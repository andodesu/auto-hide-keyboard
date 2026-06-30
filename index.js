import { eventSource, event_types } from "../../../script.js";

(() => {
    console.log("[AutoHideKeyboard] Loaded (event-only)");

    const getInput = () =>
        document.querySelector("#send_textarea") ||
        document.querySelector("textarea");

    let blockFocus = false;

    function hideKeyboard() {
        const el = getInput();
        if (!el) return;

        blockFocus = true;

        // Primary blur
        el.blur();
        document.activeElement?.blur();

        // Android Chrome safety re-blur
        setTimeout(() => {
            el.blur();
            document.activeElement?.blur();
        }, 100);

        // release focus lock
        setTimeout(() => {
            blockFocus = false;
        }, 500);
    }

    // ✅ ONLY trigger point: actual ST send completion
    eventSource.on(event_types.MESSAGE_SENT, hideKeyboard);

    // Prevent Android Chrome from immediately stealing focus back
    document.addEventListener("focusin", (e) => {
        if (!blockFocus) return;
        if (e.target?.tagName === "TEXTAREA") {
            e.target.blur();
        }
    });
})();