// Minimal Developer Panel (F9) for BattleMagesDev.
// Functional only — no gameplay logic here.

(function initializeDevPanel() {
    if (!DEV_MODE_ENABLED || !window.BattleMagesDev) {
        return;
    }

    const PANEL_ID = "battleMagesDevPanel";
    const STYLE_ID = "battleMagesDevPanelStyles";

    function ensurePanelStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            #${PANEL_ID} {
                position: fixed;
                top: 12px;
                right: 12px;
                z-index: 10000;
                width: 280px;
                padding: 12px;
                border: 1px solid #4a3f68;
                border-radius: 8px;
                background: rgba(18, 14, 28, 0.96);
                color: #e8e0f8;
                font: 13px/1.4 sans-serif;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
            }

            #${PANEL_ID}[hidden] {
                display: none;
            }

            #${PANEL_ID} h2 {
                margin: 0 0 10px;
                font-size: 14px;
                letter-spacing: 0.04em;
                text-transform: uppercase;
            }

            #${PANEL_ID} label {
                display: block;
                margin: 8px 0 4px;
                color: #b7a8d6;
                font-size: 11px;
                text-transform: uppercase;
            }

            #${PANEL_ID} select,
            #${PANEL_ID} button {
                width: 100%;
                box-sizing: border-box;
            }

            #${PANEL_ID} select {
                padding: 6px 8px;
                border: 1px solid #5a4d7d;
                border-radius: 4px;
                background: #1b1528;
                color: #f2ecff;
            }

            #${PANEL_ID} .dev-panel-actions {
                display: grid;
                gap: 6px;
                margin-top: 10px;
            }

            #${PANEL_ID} button {
                padding: 7px 10px;
                border: 1px solid #6d5f95;
                border-radius: 4px;
                background: #2a2140;
                color: #f4efff;
                cursor: pointer;
            }

            #${PANEL_ID} button:hover {
                background: #3a2f58;
            }

            #${PANEL_ID} .dev-panel-hint {
                margin-top: 8px;
                color: #8f83ad;
                font-size: 11px;
            }
        `;

        document.head.appendChild(style);
    }

    function createPanel() {
        ensurePanelStyles();

        const panel = document.createElement("aside");
        panel.id = PANEL_ID;
        panel.hidden = true;
        panel.setAttribute("aria-label", "Developer Panel");

        const spellOptions =
            BattleMagesDev.listSpells()
                .map(spell => {
                    return `<option value="${spell.id}">${spell.name}</option>`;
                })
                .join("");

        const enemyOptions =
            BattleMagesDev.listEnemies()
                .map(enemy => {
                    return `<option value="${enemy.id}">${enemy.name}</option>`;
                })
                .join("");

        panel.innerHTML = `
            <h2>Developer Panel</h2>

            <label for="devPanelSpeed">Kampfgeschwindigkeit</label>
            <select id="devPanelSpeed">
                <option value="0.5">0.5x</option>
                <option value="1" selected>1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
            </select>

            <label for="devPanelEnemy">Gegner</label>
            <select id="devPanelEnemy">
                <option value="dev_training_dummy">Training Dummy</option>
                ${enemyOptions}
            </select>

            <label for="devPanelSpell">Zauber (Slot 1)</label>
            <select id="devPanelSpell">
                ${spellOptions}
            </select>

            <div class="dev-panel-actions">
                <button type="button" id="devPanelPreviewSpell">Zauber testen</button>
                <button type="button" id="devPanelFillHp">HP zurücksetzen</button>
                <button type="button" id="devPanelResetFight">Kampf neu starten</button>
                <button type="button" id="devPanelStartFight">Testkampf starten</button>
            </div>

            <p class="dev-panel-hint">F9 schließt dieses Panel.</p>
        `;

        document.body.appendChild(panel);

        panel.querySelector("#devPanelSpeed")
            .addEventListener("change", event => {
                BattleMagesDev.setSpeed(
                    Number(event.target.value)
                );
            });

        panel.querySelector("#devPanelEnemy")
            .addEventListener("change", event => {
                BattleMagesDev.setEnemy(event.target.value);
            });

        panel.querySelector("#devPanelPreviewSpell")
            .addEventListener("click", () => {
                const spellId =
                    panel.querySelector("#devPanelSpell").value;

                BattleMagesDev.replaceSpell(1, spellId);
                BattleMagesDev.previewSpell(spellId);
            });

        panel.querySelector("#devPanelFillHp")
            .addEventListener("click", () => {
                BattleMagesDev.fillHP();
            });

        panel.querySelector("#devPanelResetFight")
            .addEventListener("click", () => {
                BattleMagesDev.resetFight();
            });

        panel.querySelector("#devPanelStartFight")
            .addEventListener("click", () => {
                BattleMagesDev.startTestFight();
            });

        return panel;
    }

    let panelElement = null;

    function getPanel() {
        if (!panelElement) {
            panelElement = createPanel();
        }

        return panelElement;
    }

    function togglePanel() {
        const panel = getPanel();
        panel.hidden = !panel.hidden;
    }

    document.addEventListener("keydown", event => {
        if (event.key !== "F9") {
            return;
        }

        event.preventDefault();
        togglePanel();
    });
})();
