(() => {
    console.log("[AutoHideKeyboard] Loaded");

    function hideKeyboard() {
        const el =
            document.querySelector("#send_textarea") ||
            document.querySelector("textarea");

        if (!el) return;

        el.blur();

        setTimeout(() => {
            document.activeElement?.blur?.();
        }, 30);
    }

    document.addEventListener("click", (e) => {
        const sendButton = e.target.closest("#send_but");
        if (!sendButton) return;

        // sync with browser paint cycle instead of interrupting it
        requestAnimationFrame(() => {
            hideKeyboard();
        });
    });

    console.log("[AutoHideKeyboard] optimized version loaded");
})();