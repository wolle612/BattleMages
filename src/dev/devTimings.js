// Playback speed control for Developer Mode.
// Scales existing timing constants in place; normal play uses multiplier 1.

const devTimingsState = {
    multiplier: 1,
    originalsCaptured: false,
    originalPlaybackDurations: null,
    originalCombatFlowTimings: null
};

function captureDevTimingOriginals() {
    if (devTimingsState.originalsCaptured) {
        return;
    }

    devTimingsState.originalPlaybackDurations = {
        ...PLAYBACK_DURATIONS
    };

    devTimingsState.originalCombatFlowTimings = {
        ...COMBAT_FLOW_TIMINGS
    };

    devTimingsState.originalsCaptured = true;
}

function applyDevPlaybackSpeed(multiplier) {
    if (!DEV_MODE_ENABLED) {
        return false;
    }

    const nextMultiplier =
        Number(multiplier);

    if (!Number.isFinite(nextMultiplier) || nextMultiplier <= 0) {
        return false;
    }

    captureDevTimingOriginals();

    devTimingsState.multiplier = nextMultiplier;

    Object.keys(devTimingsState.originalPlaybackDurations).forEach(key => {
        PLAYBACK_DURATIONS[key] =
            Math.max(
                1,
                Math.round(
                    devTimingsState.originalPlaybackDurations[key] /
                        nextMultiplier
                )
            );
    });

    Object.keys(devTimingsState.originalCombatFlowTimings).forEach(key => {
        COMBAT_FLOW_TIMINGS[key] =
            Math.max(
                1,
                Math.round(
                    devTimingsState.originalCombatFlowTimings[key] /
                        nextMultiplier
                )
            );
    });

    return true;
}

function getDevPlaybackSpeed() {
    return devTimingsState.multiplier;
}

function resetDevPlaybackSpeed() {
    return applyDevPlaybackSpeed(1);
}
