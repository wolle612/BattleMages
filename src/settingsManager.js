const SETTINGS_SAVE_KEY = "battlemages_settings_v1";

const DEFAULT_SETTINGS = {
    textScale: 1
};

const TEXT_SCALE_OPTIONS = [0.9, 1, 1.15];

function loadSettings() {
    if (!isLocalStorageAvailable()) {
        return { ...DEFAULT_SETTINGS };
    }

    try {
        const raw =
            localStorage.getItem(SETTINGS_SAVE_KEY);

        const saved =
            raw ? JSON.parse(raw) : {};

        return {
            ...DEFAULT_SETTINGS,
            ...saved
        };
    } catch (error) {
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings(settings) {
    if (!isLocalStorageAvailable()) {
        return;
    }

    try {
        localStorage.setItem(
            SETTINGS_SAVE_KEY,
            JSON.stringify(settings)
        );
    } catch (error) {
        console.warn(
            "[Einstellungen] Konnte nicht gespeichert werden:",
            error
        );
    }
}

function applyTextScale(scale) {
    document.documentElement.style.setProperty(
        "--ui-text-scale",
        scale
    );
}

// Muss vor dem ersten Rendern laufen (siehe game.js, Aufruf vor
// showHomeScreen()), sonst blitzt kurz die Standardgroesse auf.
function initializeSettings() {
    applyTextScale(loadSettings().textScale);
}

function setTextScale(scale) {
    if (!TEXT_SCALE_OPTIONS.includes(scale)) {
        return;
    }

    const settings =
        loadSettings();

    settings.textScale = scale;

    saveSettings(settings);
    applyTextScale(scale);
}

function getTextScale() {
    return loadSettings().textScale;
}
