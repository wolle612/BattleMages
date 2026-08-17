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

    document
        .getElementById("compendiumButton")
        .addEventListener("click", () => {
            playScreenTransition(showCompendiumScreen);
        });

    document
        .getElementById("statsButton")
        .addEventListener("click", () => {
            playScreenTransition(showStatsScreen);
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

    const metaState =
        getMetaState();

    selectedSpells = [];

    starterSpells
        .forEach(spell => {

        const card = renderSpellSelectionCard(spell);

        if (!metaState.seenSpellIds.includes(spell.id)) {
            card.classList.add("spell-card--new");
        }

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

    updateSpellSelectionCardOverflowIndicators();

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

// Zusaetzlich zu spell.starter (fest im Datensatz) zaehlen Zauber, deren
// starterUnlockArchetype-Feld bereits einmal im Archetyp-Tracker erreicht
// wurde (siehe data/spellbookPart3.js, classifyRotationArchetypes() in
// metaProgression.js) -- Baustein D, Option A der Meta-Progression-Roadmap.
function isStarterEligible(spell, metaState) {
    if (spell.starter === true) {
        return true;
    }

    return Boolean(
        spell.starterUnlockArchetype &&
        metaState.unlockedArchetypeIds.includes(spell.starterUnlockArchetype)
    );
}

function getRandomStarterOffer() {
    const metaState =
        getMetaState();

    const starterPool =
        spells.filter(spell => {
            return (
                isStarterEligible(spell, metaState) &&
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

    setFightBackground(enemy.id);
    recordSeenEnemy(enemy.id);

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

    updateRunStats(result.actionQueue);

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
                    .addEventListener("click", () => showRunRecapScreen(false));

                document
                    .getElementById("overlayRestartButton")
                    .addEventListener("click", () => {
                        removeCombatOutcomeOverlay();
                        showRunRecapScreen(false);
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
    runStats = {
        highestHit: 0,
        peakResistance: 0
    };

    recordRunStart(selectedSpells.map(spell => spell.id));

    showFightScreen();
}

// Reine Recap-Statistik, keine Kampfmechanik: liest nur die HP-/Status-
// Snapshots, die jede Kampf-Aktion ohnehin schon mitfuehrt (siehe
// addCombatAction() in battleManager.js), und haelt Bestwerte per Math.max
// ueber den gesamten Run fest.
function updateRunStats(actionQueue) {
    let previousEnemyHp = null;
    let peakResistanceThisFight = 0;

    actionQueue.forEach(action => {
        if (previousEnemyHp !== null) {
            const hit = previousEnemyHp - action.enemyHp;

            if (hit > runStats.highestHit) {
                runStats.highestHit = hit;
            }
        }

        previousEnemyHp = action.enemyHp;

        const resistanceStatus = (action.playerStatuses || [])
            .find(status => status.id === "resistance");

        if (resistanceStatus && resistanceStatus.stacks > peakResistanceThisFight) {
            peakResistanceThisFight = resistanceStatus.stacks;
        }
    });

    if (peakResistanceThisFight > runStats.peakResistance) {
        runStats.peakResistance = peakResistanceThisFight;
    }
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

                        updateRewardCardOverflowIndicators();

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
    updateRewardCardOverflowIndicators();

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
        showRunRecapScreen(true);
        return;
    }

    showFightScreen();
}

function showRunRecapScreen(victory) {
    hideVfxStage();

    // Nicht auf den Aufrufer verlassen (siehe Kommentar in
    // showFightScreen() -- gleiche Lektion, hier defensiv wiederholt statt
    // stillschweigend vorausgesetzt).
    setAppScreenMode("game");

    // Der Run ist an diesem Punkt vorbei (Sieg oder Niederlage). Der
    // Checkpoint wurde vor dem zuletzt gespielten Kampf gespeichert und
    // wuerde bei einem Reload sonst genau diesen Kampf erneut anbieten --
    // auch nach einer Niederlage. Sofort loeschen statt erst beim Klick auf
    // "Zurueck zum Hauptmenue", damit ein Reload auf dem Recap-Screen kein
    // "Weiterspielen" mehr anbietet.
    clearRunState();

    const fightsCompleted =
        victory ? enemies.length : currentFight;

    recordRunEnd({
        victory,
        fightsCompleted,
        runStats,
        finalSpellIds: selectedSpells.map(spell => spell.id),
        matchedArchetypeIds: classifyRotationArchetypes(selectedSpells),
        monoSchoolId: getMonoSchoolId(selectedSpells)
    });

    renderRunRecapScreen({
        victory,
        fightsCompleted,
        totalFights: enemies.length,
        highestHit: runStats.highestHit,
        peakResistance: runStats.peakResistance
    });

    renderReadonlyBuildList(
        getRotationSlots(),
        spellRanks
    );

    document
        .getElementById("recapHomeButton")
        .addEventListener("click", restartRun);
}

function showCompendiumScreen() {
    hideVfxStage();

    setAppScreenMode("game");

    const metaState =
        getMetaState();

    renderCompendiumScreen({
        spellEntries: getCompendiumSpellEntries(metaState),
        enemyEntries: getCompendiumEnemyEntries(metaState),
        archetypeEntries: getCompendiumArchetypeEntries(metaState)
    });

    bindSpellIcons(getGameRoot());
    bindCombatantPortraits(getGameRoot());

    document
        .getElementById("compendiumHomeButton")
        .addEventListener("click", () => {
            playScreenTransition(showHomeScreen);
        });
}

function getCompendiumSpellEntries(metaState) {
    return spells.map(spell => {
        const seen =
            metaState.seenSpellIds.includes(spell.id);

        return {
            seen,
            icon: seen ? getSpellIconPath(spell) : null,
            fallbackInitial: seen ? getSpellIconFallbackInitial(spell) : "?",
            name: seen ? spell.name : "???",
            schoolLabel: seen ? getSchoolLabel(spell.school) : "",
            rarity: seen ? getRarityView(spell.rarity) : null
        };
    });
}

function getCompendiumEnemyEntries(metaState) {
    return enemies.map(enemy => {
        const seen =
            metaState.seenEnemyIds.includes(enemy.id);

        return {
            seen,
            portraitPath: seen ? getCombatantPortraitPath("enemy", enemy.id) : null,
            name: seen ? enemy.name : "???",
            tierLabel: seen ? getEnemyTierLabel(enemy.tier) : ""
        };
    });
}

// Zeigt bewusst ARCHETYPE_COMPENDIUM_TITLES (eigens formulierte
// Spieler-Titel), nie BUILD_ARCHETYPES.label -- letzteres ist rein
// internes Design-Vokabular, siehe Kommentar dort. "sustain" war hier
// lange rausgefiltert (unerreichbar mangels Zaubern), seit
// data/spellbookPart5.js nicht mehr noetig.
function getCompendiumArchetypeEntries(metaState) {
    return Object.values(BUILD_ARCHETYPES)
        .map(archetype => {
            const unlocked =
                metaState.unlockedArchetypeIds.includes(archetype.id);

            return {
                unlocked,
                name: unlocked
                    ? ARCHETYPE_COMPENDIUM_TITLES[archetype.id]
                    : "???"
            };
        });
}

function showStatsScreen() {
    hideVfxStage();

    setAppScreenMode("game");

    renderStatsScreen(getMetaState());

    document
        .getElementById("statsHomeButton")
        .addEventListener("click", () => {
            playScreenTransition(showHomeScreen);
        });
}

showHomeScreen();
