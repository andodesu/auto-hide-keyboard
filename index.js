(() => {
    console.log("[AutoHideKeyboard] Zero-delay loaded");

    const getInput = () =>
        document.querySelector("#send_textarea") ||
        document.querySelector("textarea");

    let lastMessageCount = 0;

    function hideKeyboard() {
        const el = getInput();
        if (!el) return;

        el.blur();
        document.activeElement?.blur?.();

        // small safety pass for Android Chrome
        setTimeout(() => {
            el.blur();
        }, 50);
    }

    function checkForNewMessage() {
        const messages = document.querySelectorAll(".mes");

        if (messages.length === lastMessageCount) return;

        lastMessageCount = messages.length;

        // only trigger when message count increases
        hideKeyboard();
    }

    // Watch DOM changes (this is the key improvement)
    const observer = new MutationObserver(() => {
        checkForNewMessage();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("[AutoHideKeyboard] observing chat for new messages");
})();