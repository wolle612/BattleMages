function getGameRoot() {
    return document.getElementById("game");
}

function renderSpellSelectionScreen() {
    getGameRoot().innerHTML = `
        <p class="subtitle">Wähle 3 von 5 Zaubern für deinen Run.</p>

        <div id="selectionCounter">
            Ausgewählt: 0 / 3
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
    const card = document.createElement("div");
    card.classList.add("spell-card");

    card.innerHTML = `
        <div class="spell-name">${spell.name}</div>
        <div class="spell-description">${spell.description}</div>
        <div class="spell-element">${spell.element}</div>
    `;

    return card;
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
                                Aktiver Zauber
                            </span>
                            <strong id="combatFeedbackTitle">
                                ${viewModel.activeSpellName || "-"}
                            </strong>
                        </div>
                        <div
                            id="combatFeedbackDetail"
                            class="effect-placeholder"
                        >
                            Schaden, Schilde und Statusmeldungen
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
        viewModel.selectedSpells,
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

function renderBuildList(selectedSpells, spellRanks, activeSpellName) {
    const buildList = document.getElementById("buildList");

    selectedSpells.forEach(spell => {
        buildList.appendChild(
            renderBuildCard(
                spell,
                spellRanks,
                spell.name === activeSpellName
            )
        );
    });

    while (buildList.children.length < 5) {
        buildList.appendChild(renderEmptyBuildCard());
    }

    setupSpellTooltips();
}

function renderBuildCard(spell, spellRanks, isActive) {
    const card = document.createElement("div");
    card.classList.add("build-card");
    card.dataset.spellName = spell.name;

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
                ${romanize(spellRanks[spell.name])}
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

    card.dataset.tooltipName = spell.name;
    card.dataset.tooltipDescription = spell.description || "";
    card.dataset.tooltipRank = romanize(spellRanks[spell.name]);
    card.dataset.tooltipCooldown = spell.cooldown;
    card.tabIndex = 0;

    return card;
}

function renderEmptyBuildCard() {
    const card = document.createElement("div");
    card.classList.add("build-card", "build-card--empty");

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

    renderActionFeedback(moment);
    appendCombatLogMoment(moment);
    updateCombatBars(moment);
    updateActiveSpellCard(moment.spellName);

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
        view.actor || "Combat Moment";

    title.textContent =
        view.actionName || "-";

    detail.innerHTML =
        renderCombatFeedbackDetail(view);

    detail.classList.remove("combat-feedback--pulse");
    void detail.offsetWidth;
    detail.classList.add("combat-feedback--pulse");
}

function getCombatFeedbackView(moment) {
    const actions =
        moment.actions || [moment];

    const primaryImpactAction =
        actions.find(action => action.impact && action.impact !== "") ||
        actions.find(action => detailStartsWithImpact(action.feedbackDetail));

    const impact =
        primaryImpactAction
            ? primaryImpactAction.impact ||
                extractImpact(primaryImpactAction.feedbackDetail)
            : "";

    const impactLabel =
        primaryImpactAction
            ? primaryImpactAction.effectText ||
                stripImpact(primaryImpactAction.feedbackDetail)
            : "";

    const effectTexts =
        actions
            .filter(action => action !== primaryImpactAction)
            .map(action => action.effectText || action.feedbackDetail)
            .filter(text => text !== "");

    return {
        actor: getMomentActor(moment),
        actionName: getMomentActionName(moment),
        impact,
        impactLabel,
        effectTexts
    };
}

function getMomentActor(moment) {
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

function renderCombatFeedbackDetail(view) {
    const impactHtml =
        view.impact !== ""
            ? `
                <div class="combat-impact">
                    <span class="combat-impact-number">
                        ${view.impact}
                    </span>
                    <span class="combat-impact-label">
                        ${view.impactLabel}
                    </span>
                </div>
            `
            : "";

    const effectsHtml =
        view.effectTexts.length > 0
            ? `
                <div class="combat-effects">
                    ${view.effectTexts
                        .map(effectText => `<span>${effectText}</span>`)
                        .join("")}
                </div>
            `
            : "";

    if (impactHtml === "" && effectsHtml === "") {
        return "";
    }

    return `
        ${impactHtml}
        ${effectsHtml}
    `;
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

function stripImpact(detail) {
    return (detail || "")
        .replace(/^[+-]?\d+\s*/, "")
        .trim();
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

function setupSpellTooltips() {
    const tooltip =
        document.getElementById("spellTooltip");

    if (!tooltip) {
        return;
    }

    document
        .querySelectorAll(".build-card:not(.build-card--empty)")
        .forEach(card => {
            card.addEventListener(
                "mouseenter",
                () => showSpellTooltip(card)
            );

            card.addEventListener(
                "focus",
                () => showSpellTooltip(card)
            );

            card.addEventListener(
                "click",
                () => showSpellTooltip(card)
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

function showSpellTooltip(card) {
    const tooltip =
        document.getElementById("spellTooltip");

    if (!tooltip) {
        return;
    }

    tooltip.innerHTML = `
        <div class="tooltip-title">
            ${card.dataset.tooltipName}
        </div>
        <div class="tooltip-description">
            ${card.dataset.tooltipDescription}
        </div>
        <div class="tooltip-meta">
            <span>Rang ${card.dataset.tooltipRank}</span>
            <span>CD ${card.dataset.tooltipCooldown}</span>
        </div>
    `;

    tooltip.hidden = false;
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
        "playerHpText",
        action.playerHp,
        action.playerMaxHp
    );

    updateHpBar(
        "enemyHpFill",
        "enemyHpText",
        action.enemyHp,
        action.enemyMaxHp
    );
}

function updateHpBar(fillId, textId, value, maxValue) {
    const fill =
        document.getElementById(fillId);

    const text =
        document.getElementById(textId);

    if (!fill || !text) {
        return;
    }

    fill.style.width =
        `${getPercent(value, maxValue)}%`;

    text.textContent =
        `${value} / ${maxValue} HP`;
}

function updateActiveSpellCard(spellName) {
    document
        .querySelectorAll(".build-card")
        .forEach(card => {
            card.classList.toggle(
                "build-card--active",
                spellName !== "" &&
                card.dataset.spellName === spellName
            );
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
    const card =
        document.createElement("div");

    const isUpgrade =
        option.type === "upgrade";

    let text = "";
    let rankLabel = "";

    if (isUpgrade) {

        rankLabel = romanize(
            spellRanks[option.spell.name] + 1
        );

        text =
            `${option.spell.name} ${rankLabel}`;

    } else {

        rankLabel = "I";

        text =
            `${option.spell.name} I`;
    }

    card.classList.add(
        "spell-card",
        "reward-card",
        isUpgrade
            ? "reward-card--upgrade"
            : "reward-card--new"
    );

    card.innerHTML = `
        <span class="reward-badge ${
            isUpgrade
                ? "reward-badge--upgrade"
                : "reward-badge--new"
        }">
            ${isUpgrade ? "Upgrade" : "Neuer Zauber"}
        </span>
        <div
            class="card-icon-slot"
            aria-hidden="true"
        ></div>
        <div class="spell-name">
            ${option.spell.name}
        </div>
        <div class="card-meta">
            <span class="spell-rank">
                Rang ${rankLabel}
            </span>
        </div>
    `;

    return {
        card,
        text
    };
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
