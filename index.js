(() => {
    console.log("[AutoHideKeyboard] Loaded");

    function hideKeyboard() {
        const el =
            document.querySelector("#send_textarea") ||
            document.querySelector("textarea");

        if (!el) return;

        // blur input to trigger Android keyboard dismissal
        el.blur();

        // extra safety for Chrome/Samsung Internet
        setTimeout(() => {
            document.activeElement?.blur?.();
        }, 50);
    }

    document.addEventListener("click", (e) => {
        const sendButton = e.target.closest("#send_but");
        if (!sendButton) return;

        // wait until SillyTavern processes send
        setTimeout(hideKeyboard, 0);
    });

    console.log("[AutoHideKeyboard] Send-only hook active");
})();