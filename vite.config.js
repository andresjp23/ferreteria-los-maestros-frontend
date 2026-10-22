import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        clearMocks: true,
        restoreMocks: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            include: ["src/**/*.{js,jsx}"],
            exclude: ["src/**/*.test.{js,jsx}", "src/test/**", "src/main.jsx"],
        },
    },
})
