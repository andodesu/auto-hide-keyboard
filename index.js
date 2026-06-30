(() => {
    console.log("[AutoHideKeyboard] Loaded (DOM listener version)");

    const EXT_ID = "auto_hide_keyboard";

    function getInput() {
        return document.querySelector("#send_textarea") ||
               document.querySelector("textarea");
    }

    function isEnabled() {
        return window.extension_settings?.[EXT_ID]?.enabled !== false;
    }

    function hideKeyboard() {
        if (!isEnabled()) return;

        const el = getInput();
        if (!el) return;

        // blur immediately
        el.blur();
        document.activeElement?.blur();

        // Android safety re-blur after DOM settles
        setTimeout(() => {
            el.blur();
            document.activeElement?.blur();
        }, 80);
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

    function attachListeners() {
        // Send button (primary reliable trigger)
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#send_but")) return;
            setTimeout(hideKeyboard, 0);
        });

        // Fallback: Enter key (ST default send)
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                setTimeout(hideKeyboard, 0);
            }
        });
    }

    function init() {
        initSettings();
        addSettingsUI();
        attachListeners();
    }

    init();
})();