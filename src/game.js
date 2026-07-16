function showHomeScreen() {
    hideVfxStage();

    setAppScreenMode("home");
    renderHomeScreen();

    getGameRoot().classList.add("screen-enter");

    window.setTimeout(() => {
        getGameRoot().classList.remove("screen-enter");
    }, 420);

    document
        .getElementById("startRunButton")
        .addEventListener("click", () => {
            playScreenTransition(showSpellSelection);
        });

    document
        .getElementById("howToPlayButton")
        .addEventListener("click", () => {
            playScreenTransition(showHowToPlayScreen);
        });
}

function showHowToPlayScreen() {
    hideVfxStage();

    setAppScreenMode("game");
    renderHowToPlayScreen();

    document
        .getElementById("backToHomeButton")
        .addEventListener("click", () => {
            playScreenTransition(showHomeScreen);
        });
}

function showSpellSelection() {
    hideVfxStage();

    setAppScreenMode("selection");

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

    setupSpellTooltips(
        starterSpells,
        "#spellContainer .spell-card",
        () => 1
    );

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

    const enemy =
        enemies[currentFight];

    // VFX-Canvas ist ausschliesslich auf dem Kampfbildschirm sichtbar
    // (siehe Architekturplan, Risiko 8). renderFightScreen() unten baut
    // .battle-arena neu auf, daher wird das Einblenden dem naechsten
    // Layout-Tick ueberlassen.
    window.requestAnimationFrame(() => {
        showVfxStage();

        if (typeof preloadVfxCoreAssets === "function") {
            preloadVfxCoreAssets().catch(error => {
                console.warn(
                    "[VFX] Preload beim Kampfstart fehlgeschlagen:",
                    error
                );
            });
        }
    });

    const enemyView =
        getEnemyViewModel(enemy);

    renderFightScreen({
        fightNumber: currentFight + 1,
        totalFights: enemies.length,
        player: {
            name: "Spieler",
            hp: PLAYER_START_HP,
            maxHp: PLAYER_START_HP
        },
        enemy: {
            ...enemyView,
            hp: enemy.hp,
            maxHp: enemy.hp
        },
        actionbarSlots: getRotationSlots(),
        spellRanks,
        activeSpellName: getFirstRotationSpellId(),
        onRotationChange: refreshActionbar
    });

    document
        .getElementById("fightButton")
        .addEventListener("click", handleFightStart);
}

function refreshActionbar() {
    const buildList =
        document.getElementById("buildList");

    if (!buildList) {
        return;
    }

    renderBuildList({
        actionbarSlots: getRotationSlots(),
        spellRanks,
        activeSpellName: getFirstRotationSpellId(),
        onRotationChange: refreshActionbar
    });
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
    spellPaths = {};

    selectedSpells.forEach(spell => {
        initializeSpellProgress(spell.id);
    });

    currentFight = 0;

    showFightScreen();
}

function showRewardScreen() {

    hideVfxStage();

    let selectedReward = null;
    let currentOptions = [];

    renderRewardScreen();

    renderReadonlyBuildList(
        getRotationSlots(),
        spellRanks
    );

    const rewardContainer =
        document.getElementById("rewardContainer");

    const confirmButton =
        document.getElementById(
            "confirmReward"
        );

    function bindRewardCardSelection(
        card,
        option,
        text
    ) {
        card.addEventListener("click", () => {
            if (option.type === "path_choice") {
                return;
            }

            document
                .querySelectorAll(".reward-card")
                .forEach(rewardCardElement =>
                    rewardCardElement.classList.remove("selected")
                );

            card.classList.add("selected");

            selectedReward = {
                option,
                text,
                path: null
            };

            confirmButton.disabled = false;
        });
    }

    function mountRewardOptions() {
        const ownedSpellIds =
            selectedSpells.map(spell => spell.id);

        const upgradeableSpells =
            getUpgradeableSpells();

        currentOptions =
            generateRewardOptions(
                currentFight,
                ownedSpellIds,
                upgradeableSpells
            );

        rewardContainer.innerHTML = "";
        selectedReward = null;
        confirmButton.disabled = true;

        currentOptions.forEach((option, slotIndex) => {
            mountRewardSlot(option, slotIndex);
        });
    }

    function mountRewardSlot(option, slotIndex) {
        const rewardSlot =
            renderRewardSlot(option, spellRanks);

        if (option.type === "path_choice") {
            (rewardSlot.pathCards || []).forEach(pathButton => {
                pathButton.addEventListener("click", event => {
                    event.stopPropagation();

                    document
                        .querySelectorAll(".reward-path-choice-option")
                        .forEach(button =>
                            button.classList.remove("selected")
                        );

                    document
                        .querySelectorAll(".reward-card")
                        .forEach(rewardCardElement =>
                            rewardCardElement.classList.remove("selected")
                        );

                    pathButton.classList.add("selected");
                    rewardSlot.card.classList.add("selected");

                    const pathChoice =
                        option.pathChoices.find(pathOption => {
                            return pathOption.path === pathButton.dataset.path;
                        });

                    selectedReward = {
                        option,
                        text: `${option.spell.name} ${romanize(PATH_CHOICE_RANK)} – ${pathChoice.label}`,
                        path: pathButton.dataset.path
                    };

                    confirmButton.disabled = false;
                });
            });
        }

        bindRewardCardSelection(
            rewardSlot.card,
            option,
            rewardSlot.text
        );

        rewardSlot.rerollButton.addEventListener(
            "click",
            event => {
                event.stopPropagation();

                if (
                    rewardSlot.rerollButton.disabled ||
                    rewardSlot.rerollButton.classList.contains(
                        "reward-reroll-btn--used"
                    )
                ) {
                    return;
                }

                const otherDisplayedSpellIds =
                    currentOptions
                        .filter((_, index) => {
                            return index !== slotIndex;
                        })
                        .map(currentOption => {
                            return currentOption.spell.id;
                        });

                const ownedSpellIds =
                    selectedSpells.map(spell => spell.id);

                const upgradeableSpells =
                    getUpgradeableSpells();

                const nextOption =
                    rerollRewardOption(
                        currentOptions[slotIndex],
                        currentFight,
                        ownedSpellIds,
                        upgradeableSpells,
                        otherDisplayedSpellIds
                    );

                const nextRewardCard =
                    renderRewardCard(
                        nextOption,
                        spellRanks
                    );

                rewardSlot.rerollButton.disabled = true;
                rewardSlot.rerollButton.classList.add(
                    "reward-reroll-btn--used"
                );

                animateRewardSlotReroll(
                    rewardSlot.cardHost,
                    nextRewardCard.card,
                    () => {
                        currentOptions[slotIndex] =
                            nextOption;

                        bindRewardCardSelection(
                            nextRewardCard.card,
                            nextOption,
                            nextRewardCard.text
                        );

                        if (
                            selectedReward &&
                            selectedReward.option === option
                        ) {
                            selectedReward = {
                                option: nextOption,
                                text: nextRewardCard.text
                            };
                        }
                    }
                );
            }
        );

        rewardContainer.appendChild(rewardSlot.slot);
    }

    mountRewardOptions();

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
                applySpellUpgradeChoice(option.spell);

                finishReward(text);

                return;
            }

            if (option.type === "path_choice") {
                if (!selectedReward.path) {
                    return;
                }

                spellPaths[option.spell.id] =
                    selectedReward.path;

                spellRanks[option.spell.id] =
                    PATH_CHOICE_RANK;

                finishReward(text);

                return;
            }

            if (selectedSpells.length < 5) {

                appendSpellToRotation(option.spell);

                initializeSpellProgress(option.spell.id);

                finishReward(text);

                return;

            } else {

                showSpellReplaceScreen(
                    option.spell
                );

                return;
            }
        }
    );
}

function getUpgradeableSpells() {
    return selectedSpells.filter(spell => {
        return isSpellUpgradeable(spell);
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
                        removeSpellFromRotation(
                            oldSpell.id
                        );

                        removeSpellProgress(
                            oldSpell.id
                        );

                        appendSpellToRotation(
                            newSpell
                        );

                        initializeSpellProgress(
                            newSpell.id
                        );

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

        hideVfxStage();

        renderRunVictoryScreen();

        return;
    }

    showFightScreen();
}

showHomeScreen();
