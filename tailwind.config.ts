import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '100ch', // equivalent to max-w-none or custom value
                        color: '#d4d4d4', // neutral-300
                        h1: { color: '#fff' },
                        h2: { color: '#fff' },
                        h3: { color: '#fff' },
                        h4: { color: '#fff' },
                        strong: { color: '#fff' },
                        a: { color: '#fff', '&:hover': { color: '#a3a3a3' } },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
