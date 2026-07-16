const MAX_ROTATION_SLOTS = 5;

function getPlayerRotation() {
    return [...selectedSpells];
}

function getRotationSlots(
    spellsToSlot = getPlayerRotation(),
    maxSlots = MAX_ROTATION_SLOTS
) {
    const rotation =
        spellsToSlot.slice(0, maxSlots);

    const slots = [];

    for (let index = 0; index < maxSlots; index++) {
        slots.push({
            slotId: `actionbar-slot-${index + 1}`,
            slotIndex: index + 1,
            spell: rotation[index] || null
        });
    }

    return slots;
}

function createRotationOrderOverrides(spellsToOrder) {
    return spellsToOrder.reduce((overrides, spell, index) => {
        overrides[spell.id] = index + 1;
        return overrides;
    }, {});
}

function moveSpellInRotation(fromIndex, toIndex) {
    if (fromIndex === toIndex) {
        return false;
    }

    if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= selectedSpells.length ||
        toIndex >= selectedSpells.length
    ) {
        return false;
    }

    const spell =
        selectedSpells[fromIndex];

    if (!spell) {
        return false;
    }

    selectedSpells.splice(fromIndex, 1);
    selectedSpells.splice(toIndex, 0, spell);

    return selectedSpells.every(Boolean);
}

function appendSpellToRotation(spell) {
    if (
        selectedSpells.some(
            selectedSpell => selectedSpell.id === spell.id
        )
    ) {
        return false;
    }

    if (selectedSpells.length >= MAX_ROTATION_SLOTS) {
        return false;
    }

    selectedSpells.push(spell);

    return true;
}

function replaceSpellInRotation(oldSpellId, newSpell) {
    const spellIndex =
        selectedSpells.findIndex(
            spell => spell.id === oldSpellId
        );

    if (spellIndex < 0) {
        return false;
    }

    selectedSpells.splice(spellIndex, 1, newSpell);

    return true;
}

function removeSpellFromRotation(spellId) {
    const spellIndex =
        selectedSpells.findIndex(
            spell => spell.id === spellId
        );

    if (spellIndex < 0) {
        return false;
    }

    selectedSpells.splice(spellIndex, 1);

    return true;
}

function getFirstRotationSpellId() {
    return selectedSpells[0]
        ? selectedSpells[0].id
        : "";
}

function getActionbarSlots(spellsToSlot, maxSlots = MAX_ROTATION_SLOTS) {
    return getRotationSlots(spellsToSlot, maxSlots);
}
