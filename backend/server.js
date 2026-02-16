const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;
// Enable CORS for frontend
app.use(cors());
app.use(express.json());
// Twitter API endpoint
app.get("/api/tweets", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.twitter.com/2/tweets/search/recent",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                },
                params: {
                    query: "@AnthropicAI @Replit @LightspeedIndia -is:reply -is:retweet",
                    max_results: 50,
                    "tweet.fields":
                        "created_at,public_metrics,author_id,attachments",
                    "user.fields": "username,name,profile_image_url",
                    "media.fields": "url,preview_image_url,type",
                    expansions: "author_id,attachments.media_keys",
                },
            }
        );
        // Transform the data to match our frontend format
        const allTweets = response.data.data.map((tweet) => {
            const author = response.data.includes.users.find(
                (u) => u.id === tweet.author_id
            );
            const createdAt = new Date(tweet.created_at);
            const now = new Date();
            const hoursAgo = Math.floor((now - createdAt) / (1000 * 60 * 60));

            // Get ALL media if available
            let media = null;
            if (
                tweet.attachments &&
                tweet.attachments.media_keys &&
                response.data.includes?.media
            ) {
                // Get ALL media items, not just the first one
                const allMedia = tweet.attachments.media_keys
                    .map((mediaKey) => {
                        const mediaData = response.data.includes.media.find(
                            (m) => m.media_key === mediaKey
                        );
                        if (mediaData) {
                            return {
                                type: mediaData.type,
                                url:
                                    mediaData.url ||
                                    mediaData.preview_image_url,
                            };
                        }
                        return null;
                    })
                    .filter((m) => m !== null);

                // If we have multiple media, use array, otherwise use single object for backwards compatibility
                media =
                    allMedia.length > 1
                        ? allMedia
                        : allMedia.length === 1
                          ? allMedia[0]
                          : null;
            }

            return {
                id: tweet.id,
                author: author.username,
                authorName: author.name,
                authorImage: author.profile_image_url
                    ? author.profile_image_url.replace("_normal", "_bigger")
                    : null,
                content: tweet.text,
                time: hoursAgo < 1 ? "Just now" : `${hoursAgo}h ago`,
                likes: tweet.public_metrics.like_count,
                retweets: tweet.public_metrics.retweet_count,
                media: media,
            };
        });

        // Filter to keep up to 3 tweets per user (their latest ones)
        const userTweetCount = new Map();
        const filteredTweets = allTweets.filter((tweet) => {
            const count = userTweetCount.get(tweet.author) || 0;
            if (count >= 3) {
                console.log(
                    `Filtering out tweet from @${tweet.author} (already have 3)`
                );
                return false;
            }
            userTweetCount.set(tweet.author, count + 1);
            return true;
        });

        // Take only the first 15 tweets total
        const tweets = filteredTweets.slice(0, 15);

        console.log(
            `Total tweets fetched: ${allTweets.length}, After filtering: ${filteredTweets.length}, Returning: ${tweets.length}`
        );
        console.log(`Users: ${tweets.map((t) => "@" + t.author).join(", ")}`);

        res.json({ tweets });
    } catch (error) {
        console.error(
            "Twitter API Error:",
            error.response?.data || error.message
        );
        res.status(500).json({
            error: "Failed to fetch tweets",
            details: error.response?.data || error.message,
        });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📡 Twitter endpoint: http://localhost:${PORT}/api/tweets`);
});
