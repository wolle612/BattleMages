const spellPriority =
    createSpellPriority(spellDefinitions);

const PLAYER_START_HP = 120;

const STARTER_OFFER_COUNT = 5;

const STARTER_SELECTION_COUNT = 3;

const PLAYBACK_DURATIONS = {
    minor: 520,
    normal: 780,
    important: 1120
};

const COMBAT_FLOW_TIMINGS = {
    actorSwitchPause: 110,
    feedbackRead: 230,
    feedbackReadMinor: 320,
    feedbackReadFollowUp: 190,
    beforeImpact: 45,
    impactRead: 290,
    impactReadFollowUp: 250,
    afterBars: 95,
    microPause: 75,
    feedbackFade: 120
};
