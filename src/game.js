function showSpellSelection() {

    renderSpellSelectionScreen();

    const spellContainer = document.getElementById("spellContainer");
    const selectionCounter = document.getElementById("selectionCounter");
    const startButton = document.getElementById("startButton");

    selectedSpells = [];

    spells
        .filter(spell => spell.starter)
        .forEach(spell => {

        const card = renderSpellSelectionCard(spell);

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

    renderFightScreen({
        fightNumber: currentFight + 1,
        totalFights: enemies.length,
        player: {
            name: "Spieler",
            hp: PLAYER_START_HP,
            maxHp: PLAYER_START_HP
        },
        enemy: {
            name: enemy.name,
            hp: enemy.hp,
            maxHp: enemy.hp
        },
        selectedSpells,
        spellRanks,
        activeSpellName: getCurrentActiveSpellName()
    });

    document
        .getElementById("fightButton")
        .addEventListener("click", handleFightStart);
}

function getCurrentActiveSpellName() {
    const sortedSpells =
        [...selectedSpells].sort((a, b) => {
            return spellPriority[a.name] - spellPriority[b.name];
        });

    return sortedSpells[0]
        ? sortedSpells[0].name
        : "";
}

function handleFightStart() {

    const result = simulateFight();

    document.getElementById("fightButton").disabled = true;

    renderCombatPlayback(
        result,
        () => {

            if (result.victory) {

                document
                    .getElementById("rewardButton")
                    .addEventListener("click", showRewardScreen);
            }
        }
    );
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

    renderRewardScreen();

    const rewardContainer =
        document.getElementById("rewardContainer");

    const confirmButton =
        document.getElementById(
            "confirmReward"
        );

    rewardOptions.forEach(option => {

        const rewardCard =
            renderRewardCard(
                option,
                spellRanks
            );

        const card =
            rewardCard.card;

        const text =
            rewardCard.text;

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

    renderRewardConfirmation(text);

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

    renderSpellReplaceScreen(selectedSpells);

    document
        .querySelectorAll("#replaceContainer .spell-card")
        .forEach(
            (card, index) => {

                const oldSpell =
                    selectedSpells[index];

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
            }
        );
}

function showNextFightScreen() {

    currentFight++;

    if (
        currentFight >=
        enemies.length
    ) {

        renderRunVictoryScreen();

        return;
    }

    showFightScreen();
}

showSpellSelection();
