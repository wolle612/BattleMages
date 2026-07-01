function getGameRoot() {
    return document.getElementById("game");
}

function renderSpellSelectionScreen(starterSpellCount, selectionCount) {
    getGameRoot().innerHTML = `
        <p class="subtitle">Wähle ${selectionCount} von ${starterSpellCount} Zaubern für deinen Run.</p>

        <div id="selectionCounter">
            Ausgewählt: 0 / ${selectionCount}
        </div>

        <div id="spellContainer"></div>

        <button
            id="startButton"
            class="btn btn-primary"
            disabled
        >
            Run starten
        </button>
    `;
}

function renderSpellSelectionCard(spell) {
    const card =
        renderSpellCard(spell, 1, {
            classNames: ["spell-card--selection"]
        });

    return card;
}

function renderSpellCard(spell, rank, options = {}) {
    const card =
        document.createElement("div");

    const classNames =
        options.classNames || [];

    card.classList.add("spell-card", ...classNames);
    card.dataset.spellId = spell.id;
    card.tabIndex = 0;

    card.innerHTML =
        renderSpellCardContent(
            getSpellTooltipView(spell, rank),
            options
        );

    return card;
}

function renderSpellCardContent(view, options = {}) {
    return `
        ${options.headerHtml || ""}
        <div
            class="card-icon-slot"
            aria-hidden="true"
        >
            ${view.name.charAt(0)}
        </div>
        <div class="spell-name">
            ${view.name}
        </div>
        <div class="spell-card-rarity ${view.rarity.className}">
            [${view.rarity.label}]
        </div>
        <div class="spell-card-badges">
            ${renderSpellCardBadge(view.type.label, "spell-card-badge--type")}
            ${view.tags
                .map(tag => renderSpellCardBadge(tag.label, "spell-card-badge--tag"))
                .join("")}
        </div>
        <div class="spell-card-section">
            ${renderSpellCardLines(view.valueLines)}
        </div>
        <div class="spell-card-section spell-card-section--mechanics">
            ${renderSpellCardLines(view.mechanicLines)}
        </div>
        <div class="card-meta spell-card-footer">
            <span class="spell-rank">
                Rang ${view.rankLabel}
            </span>
        </div>
        ${options.footerHtml || ""}
    `;
}

function renderSpellCardBadge(label, className) {
    return `
        <span class="spell-card-badge ${className}">
            ${label}
        </span>
    `;
}

function renderSpellCardLines(lines) {
    if (lines.length === 0) {
        return "";
    }

    return lines
        .map(line => `
            <div class="spell-card-line">
                ${line}
            </div>
        `)
        .join("");
}

function renderFightScreen(viewModel) {
    getGameRoot().innerHTML = `
        <div class="battle-screen">

            <header class="battle-header">
                <div class="run-progress-label">
                    Kampf ${viewModel.fightNumber} / ${viewModel.totalFights}
                </div>
                <div class="run-progress-track">
                    ${renderRunProgress(
                        viewModel.fightNumber,
                        viewModel.totalFights
                    )}
                </div>
            </header>

            <section class="battle-arena">

                <aside class="combatant-panel player-panel">
                    <div
                        id="playerFloatingNumbers"
                        class="floating-number-layer"
                        aria-hidden="true"
                    ></div>

                    <div
                        class="combatant-portrait-slot"
                        aria-hidden="true"
                    ></div>

                    <h2 class="combatant-name">${viewModel.player.name}</h2>

                    <div class="hp-bar">
                        <div
                            id="playerHpFill"
                            class="hp-fill hp-fill--player"
                            style="width: ${getPercent(
                                viewModel.player.hp,
                                viewModel.player.maxHp
                            )}%"
                        ></div>
                        <div
                            id="playerShieldFill"
                            class="shield-fill"
                            style="left: ${getPercent(
                                viewModel.player.hp,
                                viewModel.player.maxHp
                            )}%; width: 0%"
                        ></div>
                    </div>

                    <div
                        id="playerHpText"
                        class="hp-text"
                    >
                        ${viewModel.player.hp} / ${viewModel.player.maxHp} HP
                    </div>

                    <div class="status-area">
                        <span class="slot-label">Buffs</span>
                        <div class="status-row status-row--buffs"></div>
                    </div>
                </aside>

                <main class="battle-center">
                    <div class="effect-stage">
                        <span class="effect-label">
                            Combat Feedback
                        </span>
                        <div class="active-spell-display">
                            <span
                                id="combatFeedbackActor"
                                class="active-spell-kicker"
                            >
                                Ansager
                            </span>
                            <strong id="combatFeedbackTitle">
                                Bereit
                            </strong>
                        </div>
                        <div
                            id="combatFeedbackDetail"
                            class="announcer-subline"
                        >
                            Bereit
                        </div>
                    </div>

                    <button
                        id="fightButton"
                        class="btn btn-primary"
                    >
                        Kampf starten
                    </button>
                </main>

                <aside class="combatant-panel enemy-panel">
                    <div
                        id="enemyFloatingNumbers"
                        class="floating-number-layer"
                        aria-hidden="true"
                    ></div>

                    <div
                        class="combatant-portrait-slot"
                        aria-hidden="true"
                    ></div>

                    <h2 class="combatant-name">${viewModel.enemy.name}</h2>

                    <div class="hp-bar">
                        <div
                            id="enemyHpFill"
                            class="hp-fill hp-fill--enemy"
                            style="width: ${getPercent(
                                viewModel.enemy.hp,
                                viewModel.enemy.maxHp
                            )}%"
                        ></div>
                        <div
                            id="enemyShieldFill"
                            class="shield-fill"
                            style="left: ${getPercent(
                                viewModel.enemy.hp,
                                viewModel.enemy.maxHp
                            )}%; width: 0%"
                        ></div>
                    </div>

                    <div
                        id="enemyHpText"
                        class="hp-text"
                    >
                        ${viewModel.enemy.hp} / ${viewModel.enemy.maxHp} HP
                    </div>

                    <div class="status-area">
                        <span class="slot-label">Debuffs</span>
                        <div class="status-row status-row--debuffs"></div>
                    </div>
                </aside>

            </section>

            <section class="spellbar">
                <div class="spellbar-header">
                    <h2 class="panel-title">Zauberleiste</h2>
                    <span class="rotation-hint">
                        Rotation
                    </span>
                </div>
                <div id="buildList" class="actionbar"></div>
                <div
                    id="spellTooltip"
                    class="spell-tooltip"
                    hidden
                ></div>
            </section>

            <section id="combatLog" class="combat-log"></section>

        </div>
    `;

    renderBuildList(
        viewModel.actionbarSlots,
        viewModel.spellRanks,
        viewModel.activeSpellName
    );
}

function renderRunProgress(fightNumber, totalFights) {
    const markers = [];

    for (let index = 1; index <= totalFights; index++) {
        const isBoss =
            index === totalFights;

        const stateClass =
            index < fightNumber
                ? "run-marker--complete"
                : index === fightNumber
                    ? "run-marker--current"
                    : "run-marker--future";

        const symbol =
            isBoss
                ? "👑"
                : index < fightNumber
                    ? "●"
                    : index === fightNumber
                        ? "◎"
                        : "○";

        markers.push(`
            <span class="run-marker ${stateClass} ${
                isBoss ? "run-marker--boss" : ""
            }">
                ${symbol}
            </span>
        `);
    }

    return markers.join("");
}

function renderBuildList(actionbarSlots, spellRanks, activeSpellName) {
    const buildList = document.getElementById("buildList");

    actionbarSlots.forEach(slot => {
        if (slot.spell) {
            buildList.appendChild(
                renderBuildCard(
                    slot,
                    spellRanks,
                    slot.spell.id === activeSpellName
                )
            );
            return;
        }

        buildList.appendChild(renderEmptyBuildCard(slot));
    });

    setupSpellTooltips(
        actionbarSlots
            .map(slot => slot.spell)
            .filter(spell => spell),
        ".build-card:not(.build-card--empty)",
        spell => spellRanks[spell.id]
    );
}

function renderBuildCard(slot, spellRanks, isActive) {
    const spell =
        slot.spell;

    const card = document.createElement("div");
    card.classList.add("build-card");
    card.dataset.spellId = spell.id;
    card.dataset.slotId = slot.slotId;
    card.dataset.slotIndex = slot.slotIndex;

    if (isActive) {
        card.classList.add("build-card--active");
    }

    card.innerHTML = `
        <div
            class="card-icon-slot"
            aria-hidden="true"
        >
            ${spell.name.charAt(0)}
        </div>
        <div class="card-meta">
            <span class="spell-rank">
                ${romanize(spellRanks[spell.id])}
            </span>
            <span class="spell-cooldown">
                CD ${spell.cooldown}
            </span>
        </div>
        <div class="spell-status">
            Bereit
        </div>
        <span class="sr-only">${spell.name}</span>
    `;

    card.tabIndex = 0;

    return card;
}

function renderEmptyBuildCard(slot) {
    const card = document.createElement("div");
    card.classList.add("build-card", "build-card--empty");
    card.dataset.slotId = slot.slotId;
    card.dataset.slotIndex = slot.slotIndex;

    card.innerHTML = `
        <div
            class="card-icon-slot card-icon-slot--empty"
            aria-hidden="true"
        ></div>
        <div class="spell-status">
            Frei
        </div>
    `;

    return card;
}

function renderCombatPlayback(result, onComplete) {
    const combatLog =
        document.getElementById("combatLog");

    combatLog.innerHTML = `
        <h2>Kampflog</h2>
    `;

    const moments =
        createCombatMoments(result.actionQueue);

    playCombatMoment(
        result,
        moments,
        0,
        onComplete
    );
}

function playCombatMoment(result, moments, index, onComplete) {
    if (index >= moments.length) {
        renderCombatOutcome(result);

        if (onComplete) {
            onComplete();
        }

        return;
    }

    const moment =
        moments[index];

    const timings =
        getMomentFlowTimings();

    updateActiveSpellCard(moment.spellName, true);
    renderActionFeedback(moment);
    appendCombatLogMoment(moment);

    setTimeout(
        () => {
            renderFloatingImpacts(moment);
            renderTargetImpacts(moment);
        },
        timings.impact
    );

    setTimeout(
        () => {
            updateCombatBars(moment);
        },
        timings.bars
    );

    setTimeout(
        () => {
            playCombatMoment(
                result,
                moments,
                index + 1,
                onComplete
            );
        },
        getMomentPlaybackDuration(moment)
    );
}

function createCombatMoments(actions) {
    const moments = [];

    actions.forEach(action => {
        if (action.type === "separator") {
            if (moments.length > 0) {
                moments[moments.length - 1].actions.push(action);
            }

            return;
        }

        const previous =
            moments[moments.length - 1];

        const shouldMergeWithPrevious =
            previous &&
            action.spellName !== "" &&
            previous.spellName === action.spellName;

        if (shouldMergeWithPrevious) {
            previous.actions.push(action);
            previous.message = action.message || previous.message;
            previous.feedbackDetail = mergeFeedbackDetail(
                previous.feedbackDetail,
                action.feedbackDetail
            );
            previous.impact =
                previous.impact || action.impact;
            previous.effectText = mergeFeedbackDetail(
                previous.effectText,
                action.effectText
            );
            previous.importance =
                previous.importance === "important" ||
                action.importance === "important"
                    ? "important"
                    : previous.importance;
            previous.playerHp = action.playerHp;
            previous.enemyHp = action.enemyHp;
            previous.playerShield = action.playerShield;
            previous.enemyShield = action.enemyShield;
            return;
        }

        moments.push({
            ...action,
            actions: [action]
        });
    });

    return moments;
}

function mergeFeedbackDetail(currentDetail, nextDetail) {
    if (!nextDetail) {
        return currentDetail;
    }

    if (!currentDetail) {
        return nextDetail;
    }

    return `${currentDetail} | ${nextDetail}`;
}

function renderActionFeedback(action) {
    const actor =
        document.getElementById("combatFeedbackActor");

    const title =
        document.getElementById("combatFeedbackTitle");

    const detail =
        document.getElementById("combatFeedbackDetail");

    if (!actor || !title || !detail) {
        return;
    }

    const view =
        getCombatFeedbackView(action);

    actor.textContent =
        view.subtitle || "Combat Moment";

    title.textContent =
        view.actionName || "-";

    detail.textContent =
        view.detail || "";

    detail.classList.remove("combat-feedback--pulse");
    void detail.offsetWidth;
    detail.classList.add("combat-feedback--pulse");
}

function getCombatFeedbackView(moment) {
    const actions =
        moment.actions || [moment];

    return {
        subtitle: getAnnouncerSubtitle(moment),
        actionName: getMomentActionName(moment),
        detail: getAnnouncerDetail(actions)
    };
}

function getAnnouncerSubtitle(moment) {
    if (moment.actor) {
        return moment.actor;
    }

    if (moment.type === "enemyAttack") {
        return moment.feedbackTitle.replace(" greift an", "");
    }

    if (moment.spellName) {
        return "Spieler";
    }

    return "";
}

function getMomentActionName(moment) {
    if (moment.actionName) {
        return moment.actionName;
    }

    if (moment.type === "enemyAttack") {
        return "Angriff";
    }

    return moment.feedbackTitle || moment.message || "-";
}

function getAnnouncerDetail(actions) {
    const detailAction =
        actions.find(action => action.importance === "important") ||
        actions.find(action => action.effectText && !action.impact);

    return detailAction
        ? detailAction.effectText || detailAction.feedbackDetail
        : "";
}

function renderFloatingImpacts(moment) {
    const actions =
        moment.actions || [moment];

    actions.forEach(action => {
        const impact =
            getActionImpact(action);

        if (impact === "") {
            return;
        }

        const target =
            getImpactTarget(action);

        if (target === "") {
            return;
        }

        renderFloatingNumber(
            target,
            impact,
            getImpactClass(action, impact)
        );
    });
}

function renderTargetImpacts(moment) {
    const targets =
        getMomentImpactTargets(moment);

    targets.forEach(target => {
        triggerTargetImpact(target);
    });
}

function getActionImpact(action) {
    if (action.impact) {
        return action.impact;
    }

    if (detailStartsWithImpact(action.feedbackDetail)) {
        return extractImpact(action.feedbackDetail);
    }

    return "";
}

function getImpactTarget(action) {
    if (
        action.type === "spellDamage" ||
        action.type === "debuff"
    ) {
        return "enemy";
    }

    if (action.type === "enemyAttack") {
        return "player";
    }

    if (action.type === "shield") {
        return action.actor && action.actor !== "Spieler"
            ? "enemy"
            : "player";
    }

    if (action.impact && action.impact.startsWith("+")) {
        return action.actor && action.actor !== "Spieler"
            ? "enemy"
            : "player";
    }

    if (
        action.impact &&
        action.impact.startsWith("-") &&
        action.actor === "Spieler"
    ) {
        return "player";
    }

    return "";
}

function getMomentImpactTargets(moment) {
    const actions =
        moment.actions || [moment];

    return [
        ...new Set(
            actions
                .filter(action => isDamageImpact(action))
                .map(getImpactTarget)
                .filter(target => target !== "")
        )
    ];
}

function isDamageImpact(action) {
    const impact =
        getActionImpact(action);

    return impact.startsWith("-");
}

function triggerTargetImpact(target) {
    const panel =
        document.querySelector(`.${target}-panel`);

    const hpFill =
        document.getElementById(`${target}HpFill`);

    const hpBar =
        hpFill
            ? hpFill.parentElement
            : null;

    restartCssAnimation(
        panel,
        "combatant-panel--hit"
    );

    restartCssAnimation(
        hpBar,
        "hp-bar--impact"
    );
}

function restartCssAnimation(element, className) {
    if (!element) {
        return;
    }

    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
}

function getImpactClass(action, impact) {
    if (action.type === "shield") {
        return "floating-number--shield";
    }

    if (impact.startsWith("+")) {
        return action.effectText === "Schild"
            ? "floating-number--shield"
            : "floating-number--heal";
    }

    return "floating-number--damage";
}

function renderFloatingNumber(target, value, className) {
    const layer =
        document.getElementById(`${target}FloatingNumbers`);

    if (!layer) {
        return;
    }

    const number =
        document.createElement("div");

    number.classList.add(
        "floating-number",
        className
    );

    number.textContent = value;
    layer.appendChild(number);

    number.addEventListener(
        "animationend",
        () => number.remove(),
        { once: true }
    );
}

function getMomentPlaybackDuration(moment) {
    if (moment.importance === "important") {
        return PLAYBACK_DURATIONS.important;
    }

    if (
        moment.type === "victory" ||
        moment.feedbackTitle === "Sieg" ||
        moment.actionName === "Großzauber"
    ) {
        return PLAYBACK_DURATIONS.important;
    }

    if (
        moment.type === "round" ||
        moment.type === "status"
    ) {
        return PLAYBACK_DURATIONS.minor;
    }

    return PLAYBACK_DURATIONS.normal;
}

function getMomentFlowTimings() {
    return {
        impact: 120,
        bars: 230
    };
}

function detailStartsWithImpact(detail) {
    return /^[+-]?\d+/.test(detail || "");
}

function extractImpact(detail) {
    const match =
        (detail || "").match(/^([+-]?\d+)/);

    return match
        ? match[1]
        : "";
}

function appendCombatLogMoment(moment) {
    const combatLog =
        document.getElementById("combatLog");

    moment.actions.forEach(action => {
        if (action.message === "") {
            combatLog.insertAdjacentHTML(
                "beforeend",
                "<br>"
            );
        } else if (action.message.startsWith("===")) {
            combatLog.insertAdjacentHTML(
                "beforeend",
                `<div><strong>${action.message}</strong></div>`
            );
        } else {
            combatLog.insertAdjacentHTML(
                "beforeend",
                `<div>${action.message}</div>`
            );
        }
    });

    combatLog.scrollTop =
        combatLog.scrollHeight;
}

function setupSpellTooltips(spellsForTooltip, selector, getRank) {
    const tooltip =
        document.getElementById("spellTooltip");

    if (!tooltip) {
        return;
    }

    document
        .querySelectorAll(selector)
        .forEach(card => {
            const spell =
                spellsForTooltip.find(
                    selectedSpell => selectedSpell.id === card.dataset.spellId
                );

            if (!spell) {
                return;
            }

            card.addEventListener(
                "mouseenter",
                () => showSpellTooltip(spell, getRank(spell))
            );

            card.addEventListener(
                "focus",
                () => showSpellTooltip(spell, getRank(spell))
            );

            card.addEventListener(
                "click",
                () => showSpellTooltip(spell, getRank(spell))
            );

            card.addEventListener(
                "mouseleave",
                hideSpellTooltip
            );

            card.addEventListener(
                "blur",
                hideSpellTooltip
            );
        });
}

function showSpellTooltip(spell, rank) {
    const tooltip =
        document.getElementById("spellTooltip");

    if (!tooltip) {
        return;
    }

    const view =
        getSpellTooltipView(spell, rank);

    tooltip.innerHTML = `
        <div class="tooltip-title">
            ${view.name}
        </div>
        <div class="tooltip-rarity ${view.rarity.className}">
            [${view.rarity.label}]
        </div>
        <div class="tooltip-badges">
            ${renderTooltipBadge(view.type.label, "tooltip-badge--type")}
            ${view.tags
                .map(tag => renderTooltipBadge(tag.label, "tooltip-badge--tag"))
                .join("")}
        </div>
        <div class="tooltip-section">
            ${renderTooltipLines(view.valueLines)}
        </div>
        <div class="tooltip-section tooltip-section--mechanics">
            ${renderTooltipLines(view.mechanicLines)}
        </div>
        <div class="tooltip-meta">
            <span>Rang ${view.rankLabel}</span>
        </div>
    `;

    tooltip.hidden = false;
}

function renderTooltipBadge(label, className) {
    return `
        <span class="tooltip-badge ${className}">
            ${label}
        </span>
    `;
}

function renderTooltipLines(lines) {
    if (lines.length === 0) {
        return "";
    }

    return lines
        .map(line => `<div class="tooltip-line">${line}</div>`)
        .join("");
}

function hideSpellTooltip() {
    const tooltip =
        document.getElementById("spellTooltip");

    if (tooltip) {
        tooltip.hidden = true;
    }
}

function updateCombatBars(action) {
    updateHpBar(
        "playerHpFill",
        "playerShieldFill",
        "playerHpText",
        action.playerHp,
        action.playerMaxHp,
        action.playerShield
    );

    updateHpBar(
        "enemyHpFill",
        "enemyShieldFill",
        "enemyHpText",
        action.enemyHp,
        action.enemyMaxHp,
        action.enemyShield
    );
}

function updateHpBar(fillId, shieldId, textId, value, maxValue, shieldValue) {
    const fill =
        document.getElementById(fillId);

    const shield =
        document.getElementById(shieldId);

    const text =
        document.getElementById(textId);

    if (!fill || !shield || !text) {
        return;
    }

    const hpPercent =
        getPercent(value, maxValue);

    const shieldPercent =
        Math.min(
            getPercent(shieldValue || 0, maxValue),
            100 - hpPercent
        );

    fill.style.width =
        `${hpPercent}%`;

    shield.style.left =
        `${hpPercent}%`;

    shield.style.width =
        `${shieldPercent}%`;

    text.textContent =
        `${value} / ${maxValue} HP`;
}

function updateActiveSpellCard(spellName, shouldTrigger = false) {
    document
        .querySelectorAll(".build-card")
        .forEach(card => {
            const isActive =
                spellName !== "" &&
                card.dataset.spellId === spellName;

            card.classList.toggle(
                "build-card--active",
                isActive
            );

            if (isActive && shouldTrigger) {
                restartCssAnimation(
                    card,
                    "build-card--triggered"
                );
            } else {
                card.classList.remove("build-card--triggered");
            }
        });
}

function renderCombatOutcome(result) {
    const combatLog =
        document.getElementById("combatLog");

    if (result.victory) {

        combatLog.innerHTML += `
            <h2 class="victory">
                Sieg!
            </h2>

            <button
                id="rewardButton"
                class="btn btn-primary"
            >
                Belohnung wählen
            </button>
    `;

        renderActionFeedback({
            feedbackTitle: "Sieg",
            feedbackDetail: "Kampf gewonnen"
        });

    }

     else {

        combatLog.innerHTML += `
            <h2 class="defeat">
                Deine Reise endet hier.
            </h2>
        `;

        renderActionFeedback({
            feedbackTitle: "Niederlage",
            feedbackDetail: "Deine Reise endet hier"
        });
    }

    combatLog.scrollTop =
        combatLog.scrollHeight;
}

function renderRewardScreen() {
    getGameRoot().innerHTML = `
        <div class="screen screen-reward">

            <h2 class="screen-title">
                Wähle eine Belohnung
            </h2>

            <div
                id="rewardContainer"
                class="reward-grid"
            ></div>

            <div class="screen-actions">
                <button
                    id="confirmReward"
                    class="btn btn-primary"
                    disabled
                >
                    Auswahl bestätigen
                </button>
            </div>

        </div>
    `;
}

function renderRewardCard(option, spellRanks) {
    const isUpgrade =
        option.type === "upgrade";

    const currentRank =
        spellRanks[option.spell.id] || 1;

    const rewardView =
        getSpellRewardView(
            option.spell,
            currentRank,
            isUpgrade
        );

    const rewardBadgeHtml = `
        <span class="reward-badge ${
            isUpgrade
                ? "reward-badge--upgrade"
                : "reward-badge--new"
        }">
            ${isUpgrade ? "Upgrade" : "Neuer Zauber"}
        </span>
    `;

    const rewardChangeHtml = `
        <div class="reward-change-list">
            ${renderRewardChangeLines(rewardView.changeLines)}
        </div>
    `;

    const card =
        renderSpellCard(
            option.spell,
            rewardView.rank,
            {
                classNames: [
                    "reward-card",
                    isUpgrade
                        ? "reward-card--upgrade"
                        : "reward-card--new"
                ],
                headerHtml: rewardBadgeHtml,
                footerHtml: isUpgrade
                    ? rewardChangeHtml
                    : ""
            }
        );

    let text = "";

    if (isUpgrade) {
        text =
            `${option.spell.name} ${rewardView.rankLabel}`;

    } else {
        text =
            `${option.spell.name} I`;
    }

    return {
        card,
        text
    };
}

function renderRewardChangeLines(lines) {
    if (lines.length === 0) {
        return "";
    }

    return lines
        .map(line => `
            <div class="reward-change-line">
                ${line}
            </div>
        `)
        .join("");
}

function renderRewardConfirmation(text) {
    getGameRoot().innerHTML = `
        <h2>
            Belohnung erhalten:
        </h2>

        <p>${text}</p>

        <button
            id="nextFightButton"
            class="btn btn-primary"
        >
            Weiter
        </button>
    `;
}

function renderSpellReplaceScreen(selectedSpells) {
    getGameRoot().innerHTML = `
        <h2>
            Maximal 5 Zauber erlaubt
        </h2>

        <p>
            Wähle einen Zauber,
            der ersetzt werden soll.
        </p>

        <div id="replaceContainer"></div>
    `;

    const container =
        document.getElementById(
            "replaceContainer"
        );

    selectedSpells.forEach(
        oldSpell => {
            const card =
                document.createElement("div");

            card.classList.add(
                "spell-card"
            );

            card.innerHTML = `
                <div class="spell-name">
                    ${oldSpell.name}
                </div>
            `;

            container.appendChild(card);
        }
    );
}

function renderRunVictoryScreen() {
    getGameRoot().innerHTML = `
        <h1>
            Run geschafft!
        </h1>
    `;
}

function getPercent(value, maxValue) {
    if (maxValue <= 0) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round((value / maxValue) * 100)
        )
    );
}
