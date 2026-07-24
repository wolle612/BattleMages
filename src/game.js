function showHomeScreen() {
    hideVfxStage();

    setAppScreenMode("home");
    renderHomeScreen(hasSavedRun());

    getGameRoot().classList.add("screen-enter");

    window.setTimeout(() => {
        getGameRoot().classList.remove("screen-enter");
    }, 420);

    const resumeButton =
        document.getElementById("resumeRunButton");

    if (resumeButton) {
        resumeButton.addEventListener("click", () => {
            playScreenTransition(() => {
                if (!resumeRun()) {
                    showHomeScreen();
                }
            });
        });
    }

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
        () => 1,
        {
            showRank: false,
            showUpgradePreview: true
        }
    );

    startButton.addEventListener("click", startRun);
}

function getRandomStarterOffer() {
    const starterPool =
        spells.filter(spell => {
            return (
                spell.starter === true &&
                (STARTER_RARITY_WEIGHTS[spell.rarity] || 0) > 0
            );
        });

    const offer = [];

    function pickNext(excludedIds, preferredRarity = null) {
        const available =
            starterPool.filter(spell => {
                if (excludedIds.includes(spell.id)) {
                    return false;
                }

                if (preferredRarity && spell.rarity !== preferredRarity) {
                    return false;
                }

                return true;
            });

        if (available.length === 0) {
            return null;
        }

        return pickWeightedEntry(
            available,
            spell => STARTER_RARITY_WEIGHTS[spell.rarity] || 0
        );
    }

    for (let slot = 0; slot < STARTER_OFFER_COUNT; slot++) {
        const usedIds =
            offer.map(spell => spell.id);

        const picked =
            pickNext(usedIds);

        if (!picked) {
            break;
        }

        offer.push(picked);
    }

    let commonCount =
        offer.filter(spell => spell.rarity === "Common").length;

    while (commonCount < STARTER_MIN_COMMON_OFFERS) {
        const replaceIndex =
            offer.findIndex(spell => spell.rarity !== "Common");

        if (replaceIndex < 0) {
            break;
        }

        const excludedIds =
            offer
                .map(spell => spell.id)
                .filter((_, index) => index !== replaceIndex);

        const replacement =
            pickNext(excludedIds, "Common");

        if (!replacement) {
            break;
        }

        offer[replaceIndex] = replacement;
        commonCount += 1;
    }

    return shuffleSpells(offer);
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

    // War bisher implizit vom Aufrufer abhaengig: showSpellSelection()
    // setzt "selection" (zufaellig CSS-kompatibel mit dem Kampfbildschirm,
    // gleicher Hintergrund/Scroll-Regelsatz), aber niemand setzte hier
    // "game" explizit. Fiel erst beim direkten Home->Kampf-Sprung ueber
    // "Weiterspielen" auf: body blieb auf "app-home" (kein Hintergrundbild,
    // overflow:hidden) haengen, da dieser Pfad NICHT ueber die
    // Zauberauswahl laeuft. Explizit setzen statt sich auf den Aufrufer zu
    // verlassen behebt das robust fuer alle Einstiegspunkte.
    setAppScreenMode("game");

    saveRunState();

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

                document
                    .getElementById("overlayRewardButton")
                    .addEventListener("click", () => {
                        removeCombatOutcomeOverlay();
                        showRewardScreen();
                    });

            } else {

                document
                    .getElementById("restartButton")
                    .addEventListener("click", restartRun);

                document
                    .getElementById("overlayRestartButton")
                    .addEventListener("click", () => {
                        removeCombatOutcomeOverlay();
                        restartRun();
                    });
            }
        }
    );
}

function restartRun() {
    clearRunState();
    playScreenTransition(showHomeScreen);
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

    function bindPathChoiceSelection(card, option, pathCards) {
        if (option.type !== "path_choice" || !pathCards) {
            return;
        }

        pathCards.forEach(pathButton => {
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
                card.classList.add("selected");

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

    function mountRewardSlot(option, slotIndex) {
        const rewardSlot =
            renderRewardSlot(option, spellRanks);

        bindPathChoiceSelection(
            rewardSlot.card,
            option,
            rewardSlot.pathCards
        );

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

                const previousOption =
                    currentOptions[slotIndex];

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
                        previousOption,
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

                        rewardSlot.card =
                            nextRewardCard.card;

                        bindPathChoiceSelection(
                            nextRewardCard.card,
                            nextOption,
                            nextRewardCard.pathCards
                        );

                        bindRewardCardSelection(
                            nextRewardCard.card,
                            nextOption,
                            nextRewardCard.text
                        );

                        if (
                            selectedReward &&
                            selectedReward.option === previousOption
                        ) {
                            if (nextOption.type === "path_choice") {
                                selectedReward = null;
                                confirmButton.disabled = true;
                            } else {
                                selectedReward = {
                                    option: nextOption,
                                    text: nextRewardCard.text,
                                    path: null
                                };
                            }
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

            if (option.type === "upgrade") {
                applySpellUpgradeChoice(option.spell);

                finishReward();

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

                finishReward();

                return;
            }

            if (selectedSpells.length < 5) {

                appendSpellToRotation(option.spell);

                initializeSpellProgress(
                    option.spell.id,
                    option.startRank || 1
                );

                finishReward();

                return;

            } else {

                showSpellReplaceScreen(
                    option.spell,
                    option.startRank || 1
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

function finishReward() {
    showNextFightScreen();
}

function showSpellReplaceScreen(
    newSpell,
    startRank = 1
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
                            newSpell.id,
                            startRank
                        );

                        finishReward();
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

        document
            .getElementById("backToHomeButton")
            .addEventListener("click", restartRun);

        return;
    }

    showFightScreen();
}

showHomeScreen();
