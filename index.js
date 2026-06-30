(() => {
    console.log("[AutoHideKeyboard] Loaded (fixed Android version)");

    const EXT_ID = "auto_hide_keyboard";

    function getInput() {
        return document.querySelector("#send_textarea") ||
               document.querySelector("textarea");
    }

    function isEnabled() {
        return window.extension_settings?.[EXT_ID]?.enabled !== false;
    }

    function forceBlur() {
        const el = getInput();
        if (!el) return;

        el.blur();
        document.activeElement?.blur();

        // Critical: Android Chrome re-focus happens AFTER tick
        requestAnimationFrame(() => {
            el.blur();
            document.activeElement?.blur();
        });

        setTimeout(() => {
            el.blur();
            document.activeElement?.blur();
        }, 150);
    }

    function hideKeyboard() {
        if (!isEnabled()) return;

        forceBlur();
    }

    function initSettings() {
        window.extension_settings ??= {};
        window.extension_settings[EXT_ID] ??= {
            enabled: true
        };
    }

    function addSettingsUI() {
        const target = document.querySelector("#extensions_settings");
        if (!target) return;

        const container = document.createElement("div");
        container.className = "inline-drawer";

        container.innerHTML = `
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Auto Hide Keyboard</b>
            </div>
            <div class="inline-drawer-content">
                <label style="display:flex; gap:8px; align-items:center;">
                    <input type="checkbox" id="ahk_toggle">
                    Enable auto hide keyboard
                </label>
            </div>
        `;

        target.appendChild(container);

        const checkbox = container.querySelector("#ahk_toggle");
        checkbox.checked = window.extension_settings[EXT_ID].enabled;

        checkbox.addEventListener("change", () => {
            window.extension_settings[EXT_ID].enabled = checkbox.checked;
        });
    }

    function waitForST() {
        if (!window.eventSource || !window.event_types) {
            setTimeout(waitForST, 100);
            return;
        }

        window.eventSource.on(
            window.event_types.MESSAGE_SENT,
            () => setTimeout(hideKeyboard, 0)
        );

        console.log("[AutoHideKeyboard] Hooked MESSAGE_SENT");
    }

    function init() {
        initSettings();
        addSettingsUI();
        waitForST();
    }

    init();
})();