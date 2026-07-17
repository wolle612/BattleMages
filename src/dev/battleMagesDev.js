// BattleMages Developer Mode — isolated testing API.
// Exposes window.BattleMagesDev only when DEV_MODE_ENABLED is true.
// Does not modify normal game flow until an API method is called.

(function initializeBattleMagesDev() {
    if (!DEV_MODE_ENABLED) {
        return;
    }

    const devSession = {
        active: false,
        enemyId: DEV_DEFAULT_ENEMY_ID,
        enemyBackup: null,
        savedCurrentFight: undefined,
        playbackGeneration: 0,
        playbackControlInstalled: false,
        nativeSetTimeout: window.setTimeout.bind(window)
    };

    function resolveDevEnemy() {
        if (devSession.enemyId === DEV_DEFAULT_ENEMY_ID) {
            return {
                ...DEV_DUMMY_ENEMY
            };
        }

        const enemy =
            enemyDefinitions.find(
                candidate => candidate.id === devSession.enemyId
            );

        if (!enemy) {
            console.warn(
                `[BattleMagesDev] Unknown enemy "${devSession.enemyId}", using dummy.`
            );

            return {
                ...DEV_DUMMY_ENEMY
            };
        }

        return {
            ...enemy
        };
    }

    function installDevPlaybackControl() {
        if (devSession.playbackControlInstalled) {
            return;
        }

        devSession.playbackControlInstalled = true;

        window.setTimeout = function devSetTimeout(callback, delay, ...args) {
            const generation =
                devSession.playbackGeneration;

            return devSession.nativeSetTimeout(() => {
                if (
                    !devSession.active ||
                    generation !== devSession.playbackGeneration
                ) {
                    return;
                }

                callback(...args);
            }, delay);
        };
    }

    function cancelDevPlayback() {
        devSession.playbackGeneration += 1;

        if (typeof interruptAllVfx === "function") {
            interruptAllVfx();
        }
    }

    function beginDevSession() {
        devSession.active = true;
        installDevPlaybackControl();
    }

    function applyDevEnemyToTestSlot() {
        if (!devSession.enemyBackup) {
            devSession.enemyBackup = enemies[0];
            devSession.savedCurrentFight = currentFight;
        }

        enemies[0] = resolveDevEnemy();
        currentFight = 0;
    }

    function cleanupDevEnemySwap() {
        if (devSession.enemyBackup) {
            enemies[0] = devSession.enemyBackup;
            devSession.enemyBackup = null;
        }

        if (devSession.savedCurrentFight !== undefined) {
            currentFight = devSession.savedCurrentFight;
            devSession.savedCurrentFight = undefined;
        }
    }

    function ensureSpellProgress(spellId) {
        if (!spellRanks[spellId]) {
            initializeSpellProgress(spellId);
        }
    }

    function ensureDefaultLoadout() {
        if (selectedSpells.length > 0) {
            return;
        }

        const fillerSpells =
            DEV_DEFAULT_FILLER_SPELL_IDS
                .map(spellId => getSpellById(spellId))
                .filter(Boolean)
                .slice(0, STARTER_SELECTION_COUNT);

        selectedSpells = fillerSpells;

        fillerSpells.forEach(spell => {
            ensureSpellProgress(spell.id);
        });
    }

    function setSpellAtSlot(slot, spellId) {
        const spell =
            getSpellById(spellId);

        if (!spell) {
            console.warn(
                `[BattleMagesDev] Unknown spell "${spellId}".`
            );

            return false;
        }

        const slotIndex = slot - 1;

        if (slotIndex < 0 || slotIndex >= MAX_ROTATION_SLOTS) {
            console.warn(
                `[BattleMagesDev] Slot must be between 1 and ${MAX_ROTATION_SLOTS}.`
            );

            return false;
        }

        const duplicateIndex =
            selectedSpells.findIndex(
                currentSpell => currentSpell.id === spell.id
            );

        if (
            duplicateIndex >= 0 &&
            duplicateIndex !== slotIndex
        ) {
            selectedSpells.splice(duplicateIndex, 1);
        }

        if (slotIndex < selectedSpells.length) {
            const replacedSpell =
                selectedSpells[slotIndex];

            selectedSpells[slotIndex] = spell;

            if (
                replacedSpell &&
                replacedSpell.id !== spell.id
            ) {
                removeSpellProgress(replacedSpell.id);
            }
        } else if (slotIndex === selectedSpells.length) {
            selectedSpells.push(spell);
        } else {
            console.warn(
                `[BattleMagesDev] Cannot place spell in slot ${slot} without filling previous slots.`
            );

            return false;
        }

        ensureSpellProgress(spell.id);

        return true;
    }

    function refreshFightScreenIfVisible() {
        const fightButton =
            document.getElementById("fightButton");

        if (!fightButton) {
            return false;
        }

        showFightScreen();
        return true;
    }

    function autoStartFight() {
        setAppScreenMode("game");
        applyDevEnemyToTestSlot();
        showFightScreen();

        window.requestAnimationFrame(() => {
            const fightButton =
                document.getElementById("fightButton");

            if (!fightButton) {
                return;
            }

            handleFightStart();
        });
    }

    function fillHpBars() {
        const enemy =
            resolveDevEnemy();

        if (typeof updateCombatBars === "function") {
            updateCombatBars({
                playerHp: PLAYER_START_HP,
                playerMaxHp: PLAYER_START_HP,
                playerShield: 0,
                enemyHp: enemy.hp,
                enemyMaxHp: enemy.hp,
                enemyShield: 0
            });
        }

        const fightButton =
            document.getElementById("fightButton");

        if (fightButton) {
            fightButton.disabled = false;
        }

        const combatLog =
            document.getElementById("combatLog");

        if (combatLog) {
            combatLog.innerHTML = `
                <h2>Kampflog</h2>
            `;
        }
    }

    const BattleMagesDev = {
        isEnabled() {
            return DEV_MODE_ENABLED;
        },

        startTestFight() {
            beginDevSession();
            ensureDefaultLoadout();
            autoStartFight();

            return {
                enemyId: devSession.enemyId,
                spells: selectedSpells.map(spell => spell.id)
            };
        },

        giveSpell(spellId) {
            beginDevSession();

            const spell =
                getSpellById(spellId);

            if (!spell) {
                console.warn(
                    `[BattleMagesDev] Unknown spell "${spellId}".`
                );

                return false;
            }

            if (
                selectedSpells.some(
                    currentSpell => currentSpell.id === spell.id
                )
            ) {
                return true;
            }

            const added =
                appendSpellToRotation(spell);

            if (added) {
                ensureSpellProgress(spell.id);
            }

            refreshFightScreenIfVisible();

            return added;
        },

        replaceSpell(slot, spellId) {
            beginDevSession();

            const replaced =
                setSpellAtSlot(slot, spellId);

            if (replaced) {
                refreshFightScreenIfVisible();
            }

            return replaced;
        },

        setEnemy(enemyId) {
            beginDevSession();
            devSession.enemyId = enemyId;

            if (devSession.active) {
                applyDevEnemyToTestSlot();
                refreshFightScreenIfVisible();
            }

            return true;
        },

        resetFight() {
            beginDevSession();
            cancelDevPlayback();
            applyDevEnemyToTestSlot();
            showFightScreen();

            return true;
        },

        setSpeed(multiplier) {
            beginDevSession();
            return applyDevPlaybackSpeed(multiplier);
        },

        getSpeed() {
            return getDevPlaybackSpeed();
        },

        fillHP() {
            beginDevSession();
            fillHpBars();
            return true;
        },

        previewSpell(spellId) {
            beginDevSession();

            const spell =
                getSpellById(spellId);

            if (!spell) {
                console.warn(
                    `[BattleMagesDev] Unknown spell "${spellId}".`
                );

                return false;
            }

            selectedSpells = [spell];
            spellRanks = {};
            spellPaths = {};
            ensureSpellProgress(spell.id);

            devSession.enemyId = DEV_DEFAULT_ENEMY_ID;

            autoStartFight();

            return {
                spellId: spell.id,
                enemyId: devSession.enemyId
            };
        },

        previewShield(target = "player") {
            beginDevSession();
            autoStartFight();

            window.setTimeout(() => {
                playPortraitShieldRise(target);

                const selector =
                    target === "enemy"
                        ? ".enemy-panel .combatant-portrait-slot"
                        : ".player-panel .combatant-portrait-slot";

                const slot =
                    document.querySelector(selector);

                if (slot) {
                    slot.classList.add("combatant-portrait-slot--shielded");
                }
            }, 250);

            return { target };
        },

        listSpells() {
            return spells.map(spell => ({
                id: spell.id,
                name: spell.name,
                school: spell.school
            }));
        },

        listEnemies() {
            return enemyDefinitions.map(enemy => ({
                id: enemy.id,
                name: enemy.name,
                encounter: enemy.encounter
            }));
        },

        cleanup() {
            cancelDevPlayback();
            cleanupDevEnemySwap();
            devSession.active = false;
            resetDevPlaybackSpeed();
            return true;
        }
    };

    window.BattleMagesDev = BattleMagesDev;
})();
