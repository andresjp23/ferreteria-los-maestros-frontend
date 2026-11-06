import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

// jsdom no implementa los métodos del <dialog> nativo que usa el Modal: se simulan para los tests
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal() {
        this.open = true
    }
    HTMLDialogElement.prototype.close = function close() {
        this.open = false
        this.dispatchEvent(new Event("close"))
    }
}

afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.useRealTimers()
    vi.unstubAllGlobals() // quita el fetch simulado con mockApi
})
