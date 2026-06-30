(() => {
    console.log("[AutoHideKeyboard] Loaded");

    const getInput = () =>
        document.querySelector("#send_textarea") ||
        document.querySelector("textarea");

    let blockFocus = false;

    function hideKeyboard() {
        const el = getInput();
        if (!el) return;

        blockFocus = true;

        el.blur();
        document.activeElement?.blur();

        setTimeout(() => {
            blockFocus = false;
        }, 600);
    }

    // Send button click
    document.addEventListener("click", (e) => {
        if (e.target.closest("#send_but")) {
            setTimeout(hideKeyboard, 0);
        }
    });

    // Enter key send
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            setTimeout(hideKeyboard, 0);
        }
    });

    // Prevent Android Chrome from instantly refocusing textarea
    document.addEventListener("focusin", (e) => {
        if (!blockFocus) return;
        if (e.target?.tagName === "TEXTAREA") {
            e.target.blur();
        }
    });
})();