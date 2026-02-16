/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "geist-mono": ['"Geist Mono"', "monospace"],
                mono: ['"Geist Mono"', "monospace"],
            },
        },
    },
    plugins: [],
};
