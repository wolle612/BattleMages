function showSpellSelection() {

    const starterSpells =
        getRandomStarterOffer();

    renderSpellSelectionScreen(
        starterSpells.length,
        STARTER_SELECTION_COUNT
    );

    const spellContainer = document.getElementById("spellContainer");
    const selectionCounter = document.getElementById("selectionCounter");
    const startButton = document.getElementById("startButton");

    selectedSpells = [];

    starterSpells
        .forEach(spell => {

        const card = renderSpellSelectionCard(spell);

        card.addEventListener("click", () => {

            const index = selectedSpells.indexOf(spell);

            if (index > -1) {

                selectedSpells.splice(index, 1);
                card.classList.remove("selected");

            } else {

                if (selectedSpells.length >= STARTER_SELECTION_COUNT) return;

                selectedSpells.push(spell);
                card.classList.add("selected");
            }

            selectionCounter.textContent =
                `Ausgewählt: ${selectedSpells.length} / ${STARTER_SELECTION_COUNT}`;

            startButton.disabled =
                selectedSpells.length !== STARTER_SELECTION_COUNT;
        });

        spellContainer.appendChild(card);
    });

    startButton.addEventListener("click", startRun);
}

function getRandomStarterOffer() {
    const starterPool =
        spells.filter(spell => spell.starter === true);

    return shuffleSpells(starterPool)
        .slice(0, STARTER_OFFER_COUNT);
}

function shuffleSpells(spellsToShuffle) {
    const shuffledSpells =
        [...spellsToShuffle];

    for (let index = shuffledSpells.length - 1; index > 0; index--) {
        const swapIndex =
            Math.floor(Math.random() * (index + 1));

        const currentSpell =
            shuffledSpells[index];

        shuffledSpells[index] =
            shuffledSpells[swapIndex];

        shuffledSpells[swapIndex] =
            currentSpell;
    }

    return shuffledSpells;
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
        actionbarSlots: getActionbarSlots(selectedSpells),
        spellRanks,
        activeSpellName: getCurrentActiveSpellName()
    });

    document
        .getElementById("fightButton")
        .addEventListener("click", handleFightStart);
}

function getCurrentActiveSpellName() {
    const sortedSpells =
        getActionbarSlots(selectedSpells)
            .map(slot => slot.spell)
            .filter(spell => spell);

    return sortedSpells[0]
        ? sortedSpells[0].id
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

        spellRanks[spell.id] = 1;

    });

    currentFight = 0;

    showFightScreen();
}

function showRewardScreen() {

    let selectedReward = null;

    const rewardOptions = [];

    const usedRewards = [];

    const ownedSpells = selectedSpells.map(
        spell => spell.id
    );

    // Upgrade-Kandidat

    const upgradeableSpells =
        getUpgradeableSpells();

    const upgradeSpell =
        upgradeableSpells[
            Math.floor(
                Math.random() * upgradeableSpells.length
            )
        ];

    if (upgradeSpell) {
        rewardOptions.push({
            type: "upgrade",
            spell: upgradeSpell
        });

        usedRewards.push(
            upgradeSpell.id
        );
    }

    // Neuer Zauber

    const newSpells =
        spells.filter(
            spell =>
                !ownedSpells.includes(spell.id)
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
    randomNewSpell.id
    );

    // Zweiter Upgrade-Kandidat

    const availableUpgrades =
        upgradeableSpells.filter(
            spell =>
                !usedRewards.includes(
                    spell.id
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
                    option.spell.id
                ]++;

                finishReward(text);

                return;

            } else {

                if (selectedSpells.length < 5) {

                    selectedSpells.push(
                        option.spell
                    );

                    spellRanks[
                        option.spell.id
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

function getUpgradeableSpells() {
    return selectedSpells.filter(spell => {
        const currentRank =
            spellRanks[spell.id] || 1;

        return currentRank < spell.upgrades.length;
    });
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
                            oldSpell.id
                        ];

                        selectedSpells.push(
                            newSpell
                        );

                        spellRanks[
                            newSpell.id
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
