(() => {
    console.log("[AutoHideKeyboard] Loading...");

    const EXT_ID = "auto_hide_keyboard";

    function getInput() {
        return document.querySelector("#send_textarea") ||
               document.querySelector("textarea");
    }

    function initSettings() {
        window.extension_settings ??= {};
        window.extension_settings[EXT_ID] ??= {
            enabled: true
        };
    }

    function addSettingsUI() {
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

        const target = document.querySelector("#extensions_settings");
        if (!target) return;

        target.appendChild(container);

        const checkbox = container.querySelector("#ahk_toggle");
        checkbox.checked = window.extension_settings[EXT_ID].enabled;

        checkbox.addEventListener("change", () => {
            window.extension_settings[EXT_ID].enabled = checkbox.checked;
        });
    }

    function initEvents() {
        let blockFocus = false;

        function hideKeyboard() {
            if (!window.extension_settings[EXT_ID].enabled) return;

            const el = getInput();
            if (!el) return;

            blockFocus = true;

            el.blur();
            document.activeElement?.blur();

            setTimeout(() => {
                el.blur();
                document.activeElement?.blur();
            }, 100);

            setTimeout(() => {
                blockFocus = false;
            }, 500);
        }

        // Wait for ST globals safely
        const wait = () => {
            if (!window.eventSource || !window.event_types) {
                setTimeout(wait, 100);
                return;
            }

            window.eventSource.on(
                window.event_types.MESSAGE_SENT,
                hideKeyboard
            );

            console.log("[AutoHideKeyboard] Hooked MESSAGE_SENT");
        };

        wait();

        // Prevent Android Chrome re-focus loop
        document.addEventListener("focusin", (e) => {
            if (!blockFocus) return;
            if (e.target?.tagName === "TEXTAREA") {
                e.target.blur();
            }
        });
    }

    function init() {
        initSettings();
        addSettingsUI();
        initEvents();

        console.log("[AutoHideKeyboard] Ready");
    }

    init();
})();