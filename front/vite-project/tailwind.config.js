/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            animation: {
                "slide-in":
                    "1s cubic-bezier(0.4, 0, 0.2, 1) 0s forwards slideIn",
                "blur-in": "1s ease-in 0s forwards blurIn",
                "open-down":
                    "1s cubic-bezier(0.4, 0, 0.2, 1) 0s forwards openDown",
            },
            keyframes: {
                slideIn: {
                    from: { width: "0px" },
                    to: { width: "100%" },
                },
                openDown: {
                    from: { height: "0px" },
                    to: { height: "100%" },
                },
                blurIn: {
                    from: { filter: "blur(0)" },
                    to: { filter: "blur(12px)" },
                },
            },
        },
    },
    plugins: [],
};
