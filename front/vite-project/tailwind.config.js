/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            animation: {
                "slide-in":
                    "1s cubic-bezier(0.4, 0, 0.2, 1) 0s forwards slideIn",
            },
            keyframes: {
                slideIn: {
                    from: { width: "0px" },
                    to: { width: "100%" },
                },
            },
        },
    },
    plugins: [],
};
