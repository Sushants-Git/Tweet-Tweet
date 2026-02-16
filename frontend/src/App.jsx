import React, { useState, useEffect } from "react";
import {
    Clock,
    Calendar,
    Twitter,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function HackathonDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTimer, setRefreshTimer] = useState(60);
    const [currentTweetIndex, setCurrentTweetIndex] = useState(0);
    const [slideTimer, setSlideTimer] = useState(10); // 10 seconds per tweet
    const [isPaused, setIsPaused] = useState(false);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Auto-refresh tweets every 60 seconds with countdown
    useEffect(() => {
        fetchTweets();

        const countdownInterval = setInterval(() => {
            setRefreshTimer((prev) => {
                if (prev <= 1) {
                    fetchTweets();
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);

    // Auto-advance slideshow every 10 seconds (only through first 15 tweets)
    useEffect(() => {
        if (tweets.length === 0 || isPaused) return;

        const slideInterval = setInterval(() => {
            setSlideTimer((prev) => {
                if (prev <= 1) {
                    setCurrentTweetIndex(
                        (current) => (current + 1) % Math.min(15, tweets.length)
                    );
                    return 10;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(slideInterval);
    }, [tweets.length, isPaused]);

    const fetchTweets = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "https://backend-chi-nine-74.vercel.app/api/tweets"
            );
            const data = await response.json();

            if (data.tweets) {
                setTweets(data.tweets);
                setCurrentTweetIndex(0); // Reset to first tweet
            }
        } catch (error) {
            console.error("Error fetching tweets:", error);
            setTweets([
                {
                    author: "techbuilder",
                    authorName: "Tech Builder",
                    content:
                        "Just submitted our project to @devfolio! 🚀 Amazing experience building with the team #hackathon",
                    time: "2h ago",
                    likes: 45,
                    retweets: 12,
                },
                {
                    author: "codewizard",
                    authorName: "Code Wizard",
                    content:
                        "Shoutout to @devfolio for the smooth platform experience. Our AI project is live! 🎉",
                    time: "3h ago",
                    likes: 89,
                    retweets: 23,
                },
                {
                    author: "hackteam",
                    authorName: "Hack Team",
                    content:
                        "Midnight coding session powered by coffee ☕ Thanks @devfolio for hosting our submissions!",
                    time: "5h ago",
                    likes: 67,
                    retweets: 15,
                },
                {
                    author: "innovator_x",
                    authorName: "Innovator X",
                    content:
                        "First hackathon using @devfolio and I'm impressed! The dashboard is so intuitive 💯",
                    time: "6h ago",
                    likes: 134,
                    retweets: 31,
                },
                {
                    author: "student_dev",
                    authorName: "Student Dev",
                    content:
                        "Learning so much at this hackathon! @devfolio makes project management easy #coding #hackathon",
                    time: "8h ago",
                    likes: 56,
                    retweets: 9,
                },
            ]);
        } finally {
            setLoading(false);
            setRefreshTimer(60);
        }
    };

    const nextTweet = () => {
        const maxTweets = Math.min(15, tweets.length);
        setCurrentTweetIndex((prev) => (prev + 1) % maxTweets);
        setSlideTimer(10);
    };

    const prevTweet = () => {
        const maxTweets = Math.min(15, tweets.length);
        setCurrentTweetIndex((prev) => (prev - 1 + maxTweets) % maxTweets);
        setSlideTimer(10);
    };

    const scheduleEvents = [
        {
            time: "9:00 AM - 10:00 AM",
            title: "Opening ceremony",
            description: "Opening ceremony",
            startTime: new Date(2026, 1, 15, 8, 45),
            endTime: new Date(2026, 1, 15, 10, 0),
        },
        {
            time: "10:00 AM - 5:00 PM",
            title: "Build",
            description: "Build",
            startTime: new Date(2026, 1, 15, 10, 45),
            endTime: new Date(2026, 1, 15, 13, 0),
        },
        {
            time: "3:45 PM - 5:00 PM",
            title: "Submission",
            description: "Submission deadline window",
            startTime: new Date(2026, 1, 15, 15, 45),
            endTime: new Date(2026, 1, 15, 17, 0),
        },
        {
            time: "5:45 PM - 7:00 PM",
            title: "Judging",
            description: "Judging",
            startTime: new Date(2026, 1, 15, 17, 45),
            endTime: new Date(2026, 1, 15, 19, 0),
        },
        {
            time: "7:45 PM - 8:30 PM",
            title: "Final demos & closing",
            description: "Final demos, closing ceremony & photos",
            startTime: new Date(2026, 1, 15, 19, 45),
            endTime: new Date(2026, 1, 15, 20, 30),
        },
        {
            time: "9:45 PM - 11:00 PM",
            title: "Wrap-up & close",
            description: "Cleanup & hard close",
            startTime: new Date(2026, 1, 15, 21, 45),
            endTime: new Date(2026, 1, 15, 23, 0),
        },
    ];

    const getEventStatus = (event) => {
        if (currentTime < event.startTime) {
            return "upcoming";
        } else if (
            currentTime >= event.startTime &&
            currentTime <= event.endTime
        ) {
            return "current";
        } else {
            return "past";
        }
    };

    const currentTweet = tweets[currentTweetIndex];

    return (
        <div className="flex h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 text-gray-900">
            {/* Left Panel - Schedule (30%) */}
            <div className="w-[30%] bg-white/80 backdrop-blur-sm border-r border-orange-200 overflow-y-auto">
                <div className="p-6 border-b border-orange-200 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-6 h-6 text-orange-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Schedule
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                            {currentTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-3">
                    {scheduleEvents.map((event, index) => {
                        const status = getEventStatus(event);
                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border transition-all ${
                                    status === "current"
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-400 shadow-lg shadow-orange-500/30 text-white"
                                        : status === "past"
                                          ? "bg-gray-100 border-gray-200 opacity-60"
                                          : "bg-white border-orange-200 hover:border-orange-300 hover:shadow-md"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div
                                            className={`text-sm font-mono mb-1 ${
                                                status === "current"
                                                    ? "text-orange-100"
                                                    : status === "past"
                                                      ? "text-gray-400"
                                                      : "text-orange-600 font-semibold"
                                            }`}
                                        >
                                            {event.time}
                                        </div>
                                        <div
                                            className={`font-semibold mb-1 ${
                                                status === "current"
                                                    ? "text-white"
                                                    : status === "past"
                                                      ? "text-gray-500"
                                                      : "text-gray-900"
                                            }`}
                                        >
                                            {event.title}
                                        </div>
                                        {event.description && (
                                            <div
                                                className={`text-xs ${
                                                    status === "current"
                                                        ? "text-orange-50"
                                                        : status === "past"
                                                          ? "text-gray-400"
                                                          : "text-gray-600"
                                                }`}
                                            >
                                                {event.description}
                                            </div>
                                        )}
                                    </div>
                                    {status === "current" && (
                                        <div className="flex items-center gap-1 ml-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-xs text-white font-bold">
                                                NOW
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Panel - Twitter Slideshow (70%) */}
            <div className="w-[70%] bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col">
                {/* Header */}
                <div className="p-[27px] border-b border-orange-200 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Twitter className="w-6 h-6 text-orange-600" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Latest Mentions
                                </h2>
                                <div className="text-sm text-gray-600 mt-0.5">
                                    @AnthropicAI • @Replit • @LightspeedIndia • @devfolio
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <span className="font-mono font-semibold text-orange-600">
                                    {refreshTimer}s
                                </span>
                            </div>
                            <button
                                onClick={fetchTweets}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slideshow Content */}
                <div className="flex-1 flex items-center justify-center p-8 relative">
                    {loading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    ) : currentTweet ? (
                        <>
                            {/* Previous Button */}
                            <button
                                onClick={prevTweet}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all z-10"
                            >
                                <ChevronLeft className="w-6 h-6 text-orange-600" />
                            </button>

                            {/* Tweet Card */}
                            <a
                                href={`https://twitter.com/${currentTweet.author}/status/${currentTweet.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="max-w-3xl w-full bg-white border-2 border-orange-200 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all cursor-pointer animate-fadeIn"
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                                        {currentTweet.authorImage ? (
                                            <img
                                                src={currentTweet.authorImage}
                                                alt={currentTweet.author}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            currentTweet.author[0].toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="font-bold text-xl text-gray-900">
                                                {currentTweet.authorName ||
                                                    `@${currentTweet.author}`}
                                            </span>
                                            <span className="text-gray-500">
                                                @{currentTweet.author}
                                            </span>
                                            <span className="text-gray-400">
                                                • {currentTweet.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                                            {currentTweet.content}
                                        </p>

                                        {/* Display tweet media - handle both single object and array */}
                                        {currentTweet.media && (
                                            <div className="mb-4">
                                                {Array.isArray(
                                                    currentTweet.media
                                                ) ? (
                                                    // Multiple images - show in grid based on count
                                                    <div
                                                        className={`grid gap-2 ${
                                                            currentTweet.media
                                                                .length === 2
                                                                ? "grid-cols-2"
                                                                : "grid-cols-3"
                                                        }`}
                                                    >
                                                        {currentTweet.media
                                                            .slice(0, 3)
                                                            .map(
                                                                (item, idx) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="rounded-xl overflow-hidden border border-orange-200"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                item.url
                                                                            }
                                                                            alt={`Tweet media ${idx + 1}`}
                                                                            className="w-full h-48 object-cover"
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                ) : (
                                                    // Single image - full width
                                                    <div className="rounded-xl overflow-hidden border border-orange-200">
                                                        <img
                                                            src={
                                                                currentTweet
                                                                    .media.url
                                                            }
                                                            alt="Tweet media"
                                                            className="w-full h-auto max-h-96 object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-8 text-gray-500">
                                            <div className="flex items-center gap-2 text-base">
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                    />
                                                </svg>
                                                <span className="font-semibold">
                                                    {currentTweet.likes}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-base">
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    />
                                                </svg>
                                                <span className="font-semibold">
                                                    {currentTweet.retweets}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            {/* Next Button */}
                            <button
                                onClick={nextTweet}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all z-10"
                            >
                                <ChevronRight className="w-6 h-6 text-orange-600" />
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-500">
                            No tweets to display
                        </div>
                    )}
                </div>

                {/* Slideshow Controls */}
                <div className="p-6 border-t border-orange-200 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                {currentTweetIndex + 1} /{" "}
                                {Math.min(15, tweets.length)}
                            </span>
                            {!isPaused && (
                                <span className="text-sm text-orange-600 font-mono font-semibold">
                                    Next in {slideTimer}s
                                </span>
                            )}
                            {isPaused && (
                                <span className="text-sm text-gray-500">
                                    (Paused)
                                </span>
                            )}
                        </div>
                        <div className="flex gap-1">
                            {tweets.slice(0, 15).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentTweetIndex(index);
                                        setSlideTimer(10);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentTweetIndex
                                            ? "bg-orange-600 w-8"
                                            : "bg-orange-200 hover:bg-orange-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
