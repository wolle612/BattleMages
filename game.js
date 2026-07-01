const game = document.getElementById("game");

let selectedSpells = [];

let spellRanks = {};

let currentFight = 0;

function showSpellSelection() {

    game.innerHTML = `
        <p class="subtitle">Wähle 3 von 5 Zaubern für deinen Run.</p>

        <div id="selectionCounter">
            Ausgewählt: 0 / 3
        </div>

        <div id="spellContainer"></div>

        <button
            id="startButton"
            class="btn btn-primary"
            disabled
        >
            Run starten
        </button>
    `;

    const spellContainer = document.getElementById("spellContainer");
    const selectionCounter = document.getElementById("selectionCounter");
    const startButton = document.getElementById("startButton");

    selectedSpells = [];

    spells
        .filter(spell => spell.starter)
        .forEach(spell => {

        const card = document.createElement("div");
        card.classList.add("spell-card");

        card.innerHTML = `
            <div class="spell-name">${spell.name}</div>
            <div class="spell-description">${spell.description}</div>
            <div class="spell-element">${spell.element}</div>
        `;

        card.addEventListener("click", () => {

            const index = selectedSpells.indexOf(spell);

            if (index > -1) {

                selectedSpells.splice(index, 1);
                card.classList.remove("selected");

            } else {

                if (selectedSpells.length >= 3) return;

                selectedSpells.push(spell);
                card.classList.add("selected");
            }

            selectionCounter.textContent =
                `Ausgewählt: ${selectedSpells.length} / 3`;

            startButton.disabled = selectedSpells.length !== 3;
        });

        spellContainer.appendChild(card);
    });

    startButton.addEventListener("click", startRun);
}

function showFightScreen() {

    const enemy = enemies[currentFight];
    const fightNumber = currentFight + 1;
    const totalFights = enemies.length;

    game.innerHTML = `
        <div class="layout">

            <div class="panel panel-build">

                <h2 class="panel-title">Dein Build</h2>

                <div id="buildList" class="build-grid"></div>

            </div>

            <div class="panel panel-enemy">

                <div class="fight-progress">
                    Kampf ${fightNumber} / ${totalFights}
                </div>

                <div
                    class="enemy-portrait-slot"
                    aria-hidden="true"
                ></div>

                <h2 class="enemy-name">${enemy.name}</h2>

                <div class="enemy-stats">
                    <div class="stat-row">
                        <span class="stat-label">Leben</span>
                        <span class="stat-value">${enemy.hp}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Schaden</span>
                        <span class="stat-value">${enemy.damage}</span>
                    </div>
                </div>

                <div class="enemy-ability-slot">
                    <span class="slot-label">Fähigkeit</span>
                    <div class="ability-placeholder"></div>
                </div>

                <button
                    id="fightButton"
                    class="btn btn-primary btn-block"
                >
                    Kampf starten
                </button>

            </div>

        </div>

        <div id="combatLog"></div>
    `;

    const buildList = document.getElementById("buildList");

    selectedSpells.forEach(spell => {

        const card = document.createElement("div");
        card.classList.add("build-card");

        card.innerHTML = `
            <div
                class="card-icon-slot"
                aria-hidden="true"
            ></div>
            <div class="spell-name">${spell.name}</div>
            <div class="card-meta">
                <span class="spell-rank">
                    Rang ${romanize(spellRanks[spell.name])}
                </span>
                <span class="spell-cooldown">
                    CD ${spell.cooldown}
                </span>
            </div>
        `;

        buildList.appendChild(card);

    });

    while (buildList.children.length < 5) {

        const card = document.createElement("div");
        card.classList.add("build-card", "build-card--empty");

        card.innerHTML = `
            <div
                class="card-icon-slot card-icon-slot--empty"
                aria-hidden="true"
            ></div>
            <div class="spell-name">Freier Slot</div>
        `;

        buildList.appendChild(card);

    }

    document
        .getElementById("fightButton")
        .addEventListener("click", simulateFight);
}

function startRun() {

    spellRanks = {};

    selectedSpells.forEach(spell => {

        spellRanks[spell.name] = 1;

    });

    currentFight = 0;

    showFightScreen();
}

function showRewardScreen() {

    let selectedReward = null;

    const rewardOptions = [];

    const usedRewards = [];

    const ownedSpells = selectedSpells.map(
        spell => spell.name
    );

    // Upgrade-Kandidat

    const upgradeSpell =
        selectedSpells[
            Math.floor(
                Math.random() * selectedSpells.length
            )
        ];

    rewardOptions.push({
        type: "upgrade",
        spell: upgradeSpell
    });

    usedRewards.push(
    upgradeSpell.name
    );

    // Neuer Zauber

    const newSpells =
        spells.filter(
            spell =>
                !ownedSpells.includes(spell.name)
        );

    const randomNewSpell =
        newSpells[
            Math.floor(
                Math.random() * newSpells.length
            )
        ];

    rewardOptions.push({
        type: "new",
        spell: randomNewSpell
    });

    usedRewards.push(
    randomNewSpell.name
    );

    // Zweiter Upgrade-Kandidat

    const availableUpgrades =
        selectedSpells.filter(
            spell =>
                !usedRewards.includes(
                    spell.name
                )
        );

    if (
        availableUpgrades.length > 0
    ) {

        const secondUpgrade =
            availableUpgrades[
                Math.floor(
                    Math.random() *
                    availableUpgrades.length
                )
            ];

        rewardOptions.push({
            type: "upgrade",
            spell: secondUpgrade
        });
    }

    game.innerHTML = `
        <div class="screen screen-reward">

            <h2 class="screen-title">
                Wähle eine Belohnung
            </h2>

            <div
                id="rewardContainer"
                class="reward-grid"
            ></div>

            <div class="screen-actions">
                <button
                    id="confirmReward"
                    class="btn btn-primary"
                    disabled
                >
                    Auswahl bestätigen
                </button>
            </div>

        </div>
    `;

    const rewardContainer =
        document.getElementById("rewardContainer");

    const confirmButton =
        document.getElementById(
            "confirmReward"
        );

    rewardOptions.forEach(option => {

        const card =
            document.createElement("div");

        const isUpgrade =
            option.type === "upgrade";

        let text = "";
        let rankLabel = "";

        if (isUpgrade) {

            rankLabel = romanize(
                spellRanks[option.spell.name] + 1
            );

            text =
                `${option.spell.name} ${rankLabel}`;

        } else {

            rankLabel = "I";

            text =
                `${option.spell.name} I`;
        }

        card.classList.add(
            "spell-card",
            "reward-card",
            isUpgrade
                ? "reward-card--upgrade"
                : "reward-card--new"
        );

        card.innerHTML = `
            <span class="reward-badge ${
                isUpgrade
                    ? "reward-badge--upgrade"
                    : "reward-badge--new"
            }">
                ${isUpgrade ? "Upgrade" : "Neuer Zauber"}
            </span>
            <div
                class="card-icon-slot"
                aria-hidden="true"
            ></div>
            <div class="spell-name">
                ${option.spell.name}
            </div>
            <div class="card-meta">
                <span class="spell-rank">
                    Rang ${rankLabel}
                </span>
            </div>
        `;

    card.addEventListener("click", () => {

        document
            .querySelectorAll(".reward-card")
            .forEach(card =>
                card.classList.remove("selected")
            );

        card.classList.add("selected");

        selectedReward = {
            option,
            text
        };

        confirmButton.disabled = false;

});

        rewardContainer.appendChild(card);

    });

    confirmButton.addEventListener(
        "click",
        () => {

            if (!selectedReward) {
                return;
            }

            const option =
                selectedReward.option;

            const text =
                selectedReward.text;

            if (option.type === "upgrade") {

                spellRanks[
                    option.spell.name
                ]++;

                finishReward(text);

                return;

            } else {

                if (selectedSpells.length < 5) {

                    selectedSpells.push(
                        option.spell
                    );

                    spellRanks[
                        option.spell.name
                    ] = 1;

                    finishReward(text);

                    return;

                } else {

                    showSpellReplaceScreen(
                        option.spell
                    );

                    return;
                }
            }
        }
    );
}

function finishReward(text) {

    game.innerHTML = `
        <h2>
            Belohnung erhalten:
        </h2>

        <p>${text}</p>

        <button
            id="nextFightButton"
            class="btn btn-primary"
        >
            Weiter
        </button>
    `;

    document
        .getElementById(
            "nextFightButton"
        )
        .addEventListener(
            "click",
            showNextFightScreen
        );
}

function showSpellReplaceScreen(
    newSpell
) {

    game.innerHTML = `
        <h2>
            Maximal 5 Zauber erlaubt
        </h2>

        <p>
            Wähle einen Zauber,
            der ersetzt werden soll.
        </p>

        <div id="replaceContainer"></div>
    `;

    const container =
        document.getElementById(
            "replaceContainer"
        );

    selectedSpells.forEach(
        oldSpell => {

            const card =
                document.createElement("div");

            card.classList.add(
                "spell-card"
            );

            card.innerHTML = `
                <div class="spell-name">
                    ${oldSpell.name}
                </div>
            `;

            card.addEventListener(
                "click",
                () => {

                    const index =
                        selectedSpells.indexOf(
                            oldSpell
                        );

                    selectedSpells.splice(
                        index,
                        1
                    );

                    delete spellRanks[
                        oldSpell.name
                    ];

                    selectedSpells.push(
                        newSpell
                    );

                    spellRanks[
                        newSpell.name
                    ] = 1;

                    finishReward(
                        `${newSpell.name} I`
                    );
                }
            );

            container.appendChild(
                card
            );
        }
    );
}

function showNextFightScreen() {

    currentFight++;

    if (
        currentFight >=
        enemies.length
    ) {

        game.innerHTML = `
            <h1>
                Run geschafft!
            </h1>
        `;

        return;
    }

    showFightScreen();
}

showSpellSelection();
