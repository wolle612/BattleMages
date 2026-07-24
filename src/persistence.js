const RUN_SAVE_KEY = "battlemages_run_v1";

function isLocalStorageAvailable() {
    try {
        const testKey = "__battlemages_storage_test__";
        localStorage.setItem(testKey, "1");
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

// Checkpoint statt Frame-genauer Persistenz: gespeichert wird nur der
// Zustand VOR jedem Kampf (siehe showFightScreen() in game.js) -- ein
// laufender Kampf selbst wird nie serialisiert. Passt zur
// Simulate-then-Replay-Architektur (ein Kampf wird instantan simuliert,
// dann nur noch abgespielt) und haelt den Umfang bewusst minimal.
function saveRunState() {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.setItem(
            RUN_SAVE_KEY,
            JSON.stringify({
                selectedSpellIds: selectedSpells.map(spell => spell.id),
                spellRanks,
                spellPaths,
                currentFight
            })
        );
    } catch (error) {
        console.warn("[Persistenz] Run konnte nicht gespeichert werden:", error);
    }
}

function loadRunState() {
    if (!isLocalStorageAvailable()) {
        return null;
    }

    try {
        const raw =
            localStorage.getItem(RUN_SAVE_KEY);

        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function clearRunState() {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.removeItem(RUN_SAVE_KEY);
    } catch (error) {
        // Nichts zu tun -- Speicher war ohnehin nicht nutzbar.
    }
}

function hasSavedRun() {
    const saved =
        loadRunState();

    return Boolean(
        saved &&
        Array.isArray(saved.selectedSpellIds) &&
        saved.selectedSpellIds.length > 0 &&
        typeof saved.currentFight === "number" &&
        saved.currentFight < enemies.length
    );
}

// Gibt true zurueck, wenn ein Run erfolgreich wiederhergestellt und der
// zugehoerige Kampfbildschirm bereits angezeigt wurde -- der Aufrufer
// (showHomeScreen) muss in diesem Fall selbst nichts mehr rendern.
function resumeRun() {
    const saved =
        loadRunState();

    if (!saved) {
        return false;
    }

    const restoredSpells =
        (saved.selectedSpellIds || [])
            .map(spellId => getSpellById(spellId))
            .filter(Boolean);

    if (
        restoredSpells.length === 0 ||
        typeof saved.currentFight !== "number" ||
        saved.currentFight >= enemies.length
    ) {
        clearRunState();
        return false;
    }

    selectedSpells = restoredSpells;
    spellRanks = saved.spellRanks || {};
    spellPaths = saved.spellPaths || {};
    currentFight = saved.currentFight;

    showFightScreen();

    return true;
}
