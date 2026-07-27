let selectedSpells = [];

let spellRanks = {};

let spellPaths = {};

let currentFight = 0;

// Reine Recap-Anzeigedaten, keine Kampfmechanik -- wird nach jedem
// simulateFight()-Aufruf per Math.max aktualisiert (siehe handleFightStart()).
let runStats = {
    highestHit: 0,
    peakResistance: 0
};
