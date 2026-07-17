const spellPriority =
    createSpellPriority(spellDefinitions);

const PLAYER_START_HP = 120;

const STARTER_OFFER_COUNT = 5;

const STARTER_SELECTION_COUNT = 3;

/* Starter offer rarity weights — Commons dominate; Epics/Legendaries stay 0
   even if a spell is accidentally flagged starter. */
const STARTER_RARITY_WEIGHTS = {
    Common: 70,
    Rare: 28,
    Epic: 0,
    Legendary: 0
};

const STARTER_MIN_COMMON_OFFERS = 2;

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
