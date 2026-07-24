function getGameRoot() {
    return document.getElementById("game");
}

function renderSpellIconHtml(spell) {
    return `
        <div
            class="card-icon-slot spell-icon"
            aria-hidden="true"
        >
            <img
                class="spell-icon__image"
                src="${getSpellIconPath(spell)}"
                alt=""
            />
            <span class="spell-icon__fallback">
                ${getSpellIconFallbackInitial(spell)}
            </span>
        </div>
    `;
}

function renderEnemyActionIconHtml(action, options = {}) {
    const iconKey =
        action.iconKey ||
        normalizeEnemyActionIconKey(action.id);

    const fallbackInitial =
        getEnemyActionIconFallbackInitial(action.name);

    const wrapperTag =
        options.popupSize
            ? "div"
            : "span";

    const wrapperClass =
        options.popupSize
            ? "card-icon-slot spell-icon"
            : "enemy-action-icon spell-icon";

    const titleAttr =
        options.popupSize
            ? ""
            : ` title="${escapeHtml(action.name)}"`;

    return `
        <${wrapperTag} class="${wrapperClass}"${titleAttr}>
            <img
                class="spell-icon__image${options.popupSize ? "" : " enemy-action-icon__image"}"
                src="${getEnemyActionIconPath(iconKey)}"
                alt=""
            />
            <span class="spell-icon__fallback${options.popupSize ? "" : " enemy-action-icon__fallback"}">
                ${fallbackInitial}
            </span>
        </${wrapperTag}>
    `;
}

function renderEnemyActionBarItem(action) {
    const stateClass =
        action.isNext
            ? "enemy-action-step--current"
            : "enemy-action-step--future";

    return `
        <div class="enemy-action-step ${stateClass}">
            ${renderEnemyActionIconHtml(action)}
            <span class="enemy-action-step__name">${escapeHtml(action.name)}</span>
        </div>
    `;
}

function renderEnemyActionTimelineConnector() {
    return `
        <div
            class="enemy-action-step__connector"
            aria-hidden="true"
        >
            <span class="enemy-action-step__arrow"></span>
        </div>
    `;
}

function renderEnemyActionTimelineProgress(actionBar) {
    if (!actionBar?.length) {
        return "";
    }

    const dots =
        actionBar
            .map(action => `
                <span
                    class="enemy-action-progress__dot${
                        action.isNext
                            ? " enemy-action-progress__dot--active"
                            : ""
                    }"
                ></span>
            `)
            .join("");

    return `
        <div
            class="enemy-action-progress"
            aria-hidden="true"
        >
            ${dots}
        </div>
    `;
}

function renderEnemyActionTimeline(actionBar) {
    if (!actionBar?.length) {
        return `
            <div class="enemy-action-timeline__empty">
                Keine Aktionen bekannt.
            </div>
        `;
    }

    const steps = [];

    actionBar.forEach((action, index) => {
        if (index > 0) {
            steps.push(renderEnemyActionTimelineConnector());
        }

        steps.push(renderEnemyActionBarItem(action));
    });

    return `
        <div class="enemy-action-timeline__track">
            ${steps.join("")}
        </div>
        ${renderEnemyActionTimelineProgress(actionBar)}
    `;
}

function renderEnemyPassiveBlock(enemy) {
    return `
        <div class="enemy-passive-block">
            <span class="enemy-section-label">Passiv</span>
            <strong class="enemy-passive-name">
                ${escapeHtml(renderEnemyPassiveName(enemy))}
            </strong>
            <p class="enemy-passive-text">
                ${escapeHtml(renderEnemyPassiveText(enemy))}
            </p>
        </div>
    `;
}

function renderEnemyActionPreview(enemy) {
    return `
        <div class="enemy-action-preview">
            <span class="enemy-section-label">Aktionsfolge</span>
            <div
                id="enemyActionBar"
                class="enemy-action-timeline"
            >
                ${renderEnemyActionTimeline(enemy.actionBar)}
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function bindSpellIcon(iconElement) {
    const image =
        iconElement.querySelector(".spell-icon__image");

    const fallback =
        iconElement.querySelector(".spell-icon__fallback");

    if (!image || !fallback) {
        return;
    }

    const showFallback = () => {
        image.classList.add("spell-icon__image--hidden");
        fallback.classList.add("spell-icon__fallback--visible");
    };

    image.addEventListener("error", showFallback);

    if (image.complete && image.naturalWidth === 0) {
        showFallback();
    }
}

function bindSpellIcons(root) {
    root.querySelectorAll(".spell-icon").forEach(bindSpellIcon);
}

function setAppScreenMode(mode) {
    document.body.classList.remove("app-home", "app-game", "app-selection");
    document.documentElement.classList.remove(
        "app-home",
        "app-game",
        "app-selection"
    );

    const screenClass =
        mode === "home"
            ? "app-home"
            : mode === "selection"
                ? "app-selection"
                : "app-game";

    document.body.classList.add(screenClass);
    document.documentElement.classList.add(screenClass);
}

function playScreenTransition(callback) {
    const root =
        getGameRoot();

    root.classList.add("screen-exit");

    window.setTimeout(() => {
        root.classList.remove("screen-exit");
        callback();
        root.classList.add("screen-enter");

        window.setTimeout(() => {
            root.classList.remove("screen-enter");
        }, 420);
    }, 240);
}

function renderHomeScreen(canResume = false) {
    const resumeButtonHtml =
        canResume
            ? `
                <button
                    id="resumeRunButton"
                    class="home-menu-btn home-menu-btn--primary"
                    type="button"
                >
                    <span class="home-menu-btn__label">
                        Weiterspielen
                    </span>
                </button>
            `
            : "";

    const startButtonLabel =
        canResume ? "Neuer Run" : "Spiel starten";

    const startButtonClass =
        canResume
            ? "home-menu-btn home-menu-btn--secondary"
            : "home-menu-btn home-menu-btn--primary";

    getGameRoot().innerHTML = `
        <div class="home-screen">
            <div
                class="home-screen-backdrop"
                role="presentation"
            ></div>

            <nav class="home-screen-menu" aria-label="Hauptmenü">
                ${resumeButtonHtml}
                <button
                    id="startRunButton"
                    class="${startButtonClass}"
                    type="button"
                >
                    <span class="home-menu-btn__label">
                        ${startButtonLabel}
                    </span>
                </button>
                <button
                    id="howToPlayButton"
                    class="home-menu-btn home-menu-btn--secondary"
                    type="button"
                >
                    <span class="home-menu-btn__label">
                        How to Play
                    </span>
                </button>
            </nav>
        </div>
    `;
}

function renderHowToPlayScreen() {
    getGameRoot().innerHTML = `
        <div class="howto-screen">
            <h2 class="screen-title">
                How to Play
            </h2>

            <div class="ui-divider ui-divider--section" aria-hidden="true"></div>

            <ol class="howto-list">
                <li>Wähle zu Beginn drei Zauber.</li>
                <li>Ordne deine Zauber per Drag &amp; Drop.</li>
                <li>Die Reihenfolge beeinflusst den Kampf.</li>
                <li>Nach jedem Kampf erhältst du Belohnungen.</li>
                <li>Verbessere deinen Build.</li>
                <li>Besiege alle Gegner.</li>
            </ol>

            <section class="howto-status-panel">
                <h3 class="howto-subtitle">
                    Wichtige Begriffe
                </h3>
                <dl class="howto-status-list">
                    <div>
                        <dt>Verwundbar</dt>
                        <dd>Das Ziel nimmt vom nächsten Treffer 50 % mehr Schaden.</dd>
                    </div>
                    <div>
                        <dt>Schild</dt>
                        <dd>Absorbiert eingehenden Schaden, bevor du Leben verlierst.</dd>
                    </div>
                    <div>
                        <dt>Vorbereitung</dt>
                        <dd>Verstärkt oder verändert deinen nächsten Zauber.</dd>
                    </div>
                    <div>
                        <dt>Kritischer Treffer</dt>
                        <dd>Verursacht doppelten Schaden.</dd>
                    </div>
                </dl>
            </section>

            <div class="screen-actions">
                <button
                    id="backToHomeButton"
                    class="btn btn-secondary"
                >
                    Zurück
                </button>
            </div>
        </div>
    `;
}

function renderCombatantPortrait(type, entityId) {
    const sources =
        getCombatantPortraitSources(type, entityId);

    if (!sources?.primary) {
        return `
            <div
                class="combatant-portrait-slot combatant-portrait-slot--placeholder combatant-portrait-slot--reveal"
                aria-hidden="true"
            ></div>
        `;
    }

    const fallbackAttribute =
        sources.fallback
            ? ` data-portrait-fallback="${sources.fallback}"`
            : "";

    const resistanceBadge =
        type === "player"
            ? `
            <div
                id="playerResistanceBadge"
                class="resistance-badge"
                hidden
                aria-hidden="true"
            >
                <span class="resistance-badge-value">0</span>
                <div class="resistance-badge-tooltip">
                    <strong>
                        Magischer Widerstand: <span class="resistance-badge-tooltip-value">0</span>
                    </strong>
                    <p>
                        Reduziert erlittenen Schaden um
                        <span class="resistance-badge-tooltip-percent">0</span> %.
                    </p>
                </div>
            </div>
        `
            : "";

    return `
        <div
            class="combatant-portrait-slot combatant-portrait-slot--${type} combatant-portrait-slot--reveal"
            aria-hidden="true"
        >
            <img
                class="combatant-portrait-image"
                src="${sources.primary}"
                alt=""
                ${fallbackAttribute}
            />
            ${renderPortraitEffectOverlaysHtml()}
            ${resistanceBadge}
        </div>
    `;
}

function renderSpellSelectionScreen(starterSpellCount, selectionCount) {
    getGameRoot().innerHTML = `
        <h2 class="screen-title">Zauberauswahl</h2>

        <p class="subtitle">Wähle ${selectionCount} von ${starterSpellCount} Zaubern für deinen Run.</p>

        <div id="selectionCounter">
            Ausgewählt: 0 / ${selectionCount}
        </div>

        <div id="spellContainer"></div>

        <div
            id="spellTooltip"
            class="spell-tooltip"
            hidden
        ></div>

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
            classNames: ["spell-card--selection"],
            variant: "selection"
        });

    return card;
}

function renderSpellCard(spell, rank, options = {}) {
    const card =
        document.createElement("div");

    const classNames =
        options.classNames || [];

    const view =
        getSpellTooltipView(spell, rank);

    card.classList.add(
        "spell-card",
        view.rarity.className,
        ...classNames
    );
    card.dataset.spellId = spell.id;
    card.tabIndex = 0;

    card.innerHTML =
        renderSpellCardContent(
            spell,
            view,
            options
        );

    bindSpellIcons(card);

    return card;
}

function renderSpellCardContent(spell, view, options = {}) {
    const variant =
        options.variant || "default";

    const showRank =
        variant !== "selection" &&
        options.showRank !== false;

    const showDescription =
        variant === "selection";

    const valueLines =
        view.valueLines || [];

    const iconHtml = renderSpellIconHtml(spell);
    const schoolHtml = `
        <div class="spell-card-school spell-card-school--${spell.school}">
            ${getSchoolLabel(spell.school)}
        </div>
    `;
    const bodyHtml = `
        <div class="spell-name">
            ${view.name}
        </div>
        <div class="spell-card-rarity ${view.rarity.className}">
            [${view.rarity.label}]
        </div>
        ${showDescription && view.description
            ? `<div class="spell-card-description">${view.description}</div>`
            : ""}
        ${renderSpellCardSections({
            direct: valueLines,
            additional: [],
            conditional: [],
            special: []
        })}
        ${showRank
            ? `
        <div class="card-meta spell-card-footer">
            <span class="spell-rank">
                Rang ${view.rankLabel}
            </span>
        </div>`
            : ""}
        ${options.footerHtml || ""}
    `;

    if (variant === "selection") {
        return `
            <div class="spell-card-channel">
                <div class="spell-card-icon-zone">
                    ${iconHtml}
                </div>
                <div class="spell-card-body">
                    ${schoolHtml}
                    ${bodyHtml}
                </div>
            </div>
        `;
    }

    if (variant === "reward") {
        return `
            ${options.headerHtml || ""}
            ${iconHtml}
            <div class="reward-card-scroll">
                ${schoolHtml}
                ${bodyHtml}
            </div>
        `;
    }

    return `
        ${options.headerHtml || ""}
        ${iconHtml}
        ${schoolHtml}
        ${bodyHtml}
    `;
}

function renderSpellCardSections(sections) {
    const sectionGroups = [
        {
            lines: sections.direct,
            className: "spell-card-section spell-card-section--direct"
        },
        {
            lines: sections.additional,
            className: "spell-card-section spell-card-section--additional"
        },
        {
            lines: sections.conditional,
            className: "spell-card-section spell-card-section--conditional"
        },
        {
            lines: sections.special,
            className: "spell-card-section spell-card-section--special"
        }
    ];

    return sectionGroups
        .filter(group => group.lines.length > 0)
        .map(group => `
            <div class="${group.className}">
                ${renderSpellCardLines(group.lines)}
            </div>
        `)
        .join("");
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
                <div class="run-progress-banner">
                    <div class="run-progress-label">
                        Kampf ${viewModel.fightNumber} / ${viewModel.totalFights}
                    </div>
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

                    <div class="combatant-panel-stack">
                        <div class="combatant-panel-head">
                            ${renderCombatantPortrait("player")}

                            <h2 class="combatant-name">
                                ${escapeHtml(viewModel.player.name)}
                            </h2>

                            <div class="hp-bar">
                                <div class="hp-bar-channel">
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
                            </div>

                            <div
                                id="playerHpText"
                                class="hp-text"
                            >
                                ${viewModel.player.hp} / ${viewModel.player.maxHp} HP
                            </div>
                        </div>

                        <div
                            class="combatant-panel-details combatant-panel-details--empty"
                            aria-hidden="true"
                        ></div>
                    </div>
                </aside>

                <div class="battle-arena-center">
                    <div
                        class="action-popup-stage"
                        aria-live="polite"
                    >
                        <div
                            id="actionPopup"
                            class="action-popup"
                            hidden
                        >
                            <div
                                id="combatFeedbackIcon"
                                class="action-popup-icon"
                                aria-hidden="true"
                            ></div>
                            <strong id="combatFeedbackTitle"></strong>
                            <span
                                id="combatFeedbackActor"
                                class="sr-only"
                            ></span>
                            <span
                                id="combatFeedbackImpact"
                                class="sr-only"
                            ></span>
                            <span
                                id="combatFeedbackDetail"
                                class="sr-only"
                            ></span>
                        </div>
                    </div>

                    <button
                        id="fightButton"
                        class="btn btn-primary battle-start-btn"
                    >
                        Kampf starten
                    </button>

                    <section class="spellbar spellbar--compact">
                        <div id="buildList" class="actionbar"></div>
                        <div
                            id="spellTooltip"
                            class="spell-tooltip"
                            hidden
                        ></div>
                    </section>
                </div>

                <aside class="combatant-panel enemy-panel">
                    <div
                        id="enemyFloatingNumbers"
                        class="floating-number-layer"
                        aria-hidden="true"
                    ></div>

                    <div class="combatant-panel-stack">
                        <div class="combatant-panel-head">
                            ${renderCombatantPortrait("enemy", viewModel.enemy.id)}

                            <h2 class="combatant-name">${escapeHtml(viewModel.enemy.name)}</h2>

                            <div class="hp-bar">
                                <div class="hp-bar-channel">
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
                            </div>

                            <div
                                id="enemyHpText"
                                class="hp-text"
                            >
                                ${viewModel.enemy.hp} / ${viewModel.enemy.maxHp} HP
                            </div>
                        </div>

                        <div class="combatant-panel-details">
                            ${renderEnemyPassiveBlock(viewModel.enemy)}
                            ${renderEnemyActionPreview(viewModel.enemy)}
                        </div>
                    </div>
                </aside>

                <div class="combat-log-shell">
                    <div
                        class="combat-log-pillar combat-log-pillar--left"
                        aria-hidden="true"
                    ></div>
                    <div class="combat-log-body">
                        <section id="combatLog" class="combat-log"></section>
                    </div>
                    <div
                        class="combat-log-pillar combat-log-pillar--right"
                        aria-hidden="true"
                    ></div>
                </div>

            </section>

        </div>
    `;

    renderBuildList({
        actionbarSlots: viewModel.actionbarSlots,
        spellRanks: viewModel.spellRanks,
        activeSpellName: viewModel.activeSpellName,
        onRotationChange: viewModel.onRotationChange
    });

    bindCombatantPortraits();

    const enemyActionBar =
        document.getElementById("enemyActionBar");

    if (enemyActionBar) {
        bindSpellIcons(enemyActionBar);
    }
}

function renderRunProgress(fightNumber, totalFights) {
    const markers = [];

    for (let index = 1; index <= totalFights; index++) {
        const enemy =
            getEnemyByEncounter(index);

        const tier =
            enemy?.tier || "Normal";

        const isElite =
            tier === "Elite";

        const isBoss =
            tier === "Boss";

        const stateClass =
            index < fightNumber
                ? "run-marker--complete"
                : index === fightNumber
                    ? "run-marker--current"
                    : "run-marker--future";

        const typeClass =
            isBoss
                ? "run-marker--boss"
                : isElite
                    ? "run-marker--elite"
                    : "run-marker--normal";

        let markerContent;

        if (isBoss) {
            markerContent = `
                <svg
                    class="run-marker-boss-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        d="M12 2.5 L20.5 9.5 L18.5 21.5 H5.5 L3.5 9.5 Z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    />
                    <path
                        d="M12 7.5 L15.5 11 L14.5 17 H9.5 L8.5 11 Z"
                        fill="currentColor"
                    />
                    <circle
                        cx="12"
                        cy="12.5"
                        r="1.4"
                        fill="#120608"
                    />
                </svg>
            `;
        } else if (isElite) {
            markerContent = "☠";
        } else {
            markerContent =
                index < fightNumber
                    ? "●"
                    : index === fightNumber
                        ? "◎"
                        : "○";
        }

        markers.push(`
            <span
                class="run-marker ${stateClass} ${typeClass}"
                title="Kampf ${index}"
            >
                ${markerContent}
            </span>
        `);
    }

    return markers.join("");
}

function renderEnemyPassiveName(enemy) {
    return enemy.passive
        ? enemy.passive.name
        : "-";
}

function renderEnemyPassiveText(enemy) {
    return enemy.passive
        ? enemy.passive.text
        : "Keine passive Fähigkeit.";
}

const VISIBLE_STATUS_DEFINITIONS = {
    vulnerable: {
        icon: "V",
        name: "Verwundbar",
        description: "Der nächste Schadenzauber trifft härter."
    },
    wound: {
        icon: "V",
        name: "Verwundbar",
        description: "Der nächste Schadenzauber trifft härter."
    }
};

function renderStatusChips(statuses) {
    return statuses
        .filter(status => VISIBLE_STATUS_DEFINITIONS[status.id])
        .map(renderStatusChip)
        .join("");
}

function renderStatusChip(status) {
    const definition =
        VISIBLE_STATUS_DEFINITIONS[status.id];

    const stackText =
        status.stacks > 1
            ? `<span class="status-chip-stack">${status.stacks}</span>`
            : "";

    const title =
        `${definition.name}\n${definition.description}${status.remaining ? `\nRestdauer: ${status.remaining}` : ""}`;

    return `
        <span
            class="status-chip status-chip--${status.id}"
            title="${title}"
        >
            <span class="status-chip-icon">${definition.icon}</span>
            <span class="status-chip-name">${definition.name}</span>
            ${stackText}
        </span>
    `;
}

let isActionbarDragging = false;
let spellTooltipHideTimeout = null;

function cancelSpellTooltipHide() {
    if (spellTooltipHideTimeout) {
        window.clearTimeout(spellTooltipHideTimeout);
        spellTooltipHideTimeout = null;
    }
}

function scheduleSpellTooltipHide() {
    cancelSpellTooltipHide();

    spellTooltipHideTimeout =
        window.setTimeout(() => {
            hideSpellTooltip();
            spellTooltipHideTimeout = null;
        }, 80);
}

function bindSpellTooltipHover() {
    const tooltip =
        document.getElementById("spellTooltip");

    if (!tooltip || tooltip.dataset.hoverBound === "true") {
        return;
    }

    tooltip.dataset.hoverBound = "true";

    tooltip.addEventListener("mouseenter", cancelSpellTooltipHide);
    tooltip.addEventListener("mouseleave", scheduleSpellTooltipHide);
    tooltip.addEventListener("focusin", cancelSpellTooltipHide);
    tooltip.addEventListener("focusout", scheduleSpellTooltipHide);
}

function renderBuildList(options) {
    const buildList = document.getElementById("buildList");

    buildList.innerHTML = "";

    options.actionbarSlots.forEach(slot => {
        if (slot.spell) {
            buildList.appendChild(
                renderBuildCard(
                    slot,
                    options.spellRanks,
                    slot.spell.id === options.activeSpellName
                )
            );
            return;
        }

        buildList.appendChild(renderEmptyBuildCard(slot));
    });

    setupSpellTooltips(
        options.actionbarSlots
            .map(slot => slot.spell)
            .filter(spell => spell),
        ".build-card:not(.build-card--empty)",
        spell => getSpellProgress(spell.id)
    );

    setupActionbarDragDrop(options.onRotationChange);
}

function setupActionbarDragDrop(onRotationChange) {
    const buildList =
        document.getElementById("buildList");

    if (!buildList || typeof onRotationChange !== "function") {
        return;
    }

    const canReorder =
        () => !document.getElementById("fightButton")?.disabled;

    let dragState = null;

    function getCards() {
        return [
            ...buildList.querySelectorAll(
                ".build-card:not(.build-card--empty)"
            )
        ];
    }

    function moveFloatingCard(event) {
        if (!dragState?.clone) {
            return;
        }

        dragState.clone.style.left =
            `${event.clientX - dragState.offsetX}px`;

        dragState.clone.style.top =
            `${event.clientY - dragState.offsetY}px`;
    }

    function getDropIndexFromPointer(clientX) {
        if (!dragState) {
            return 0;
        }

        const otherCards =
            getCards()
                .filter(card => card !== dragState.card)
                .sort(
                    (left, right) =>
                        left.getBoundingClientRect().left -
                        right.getBoundingClientRect().left
                );

        for (const card of otherCards) {
            const rect =
                card.getBoundingClientRect();

            const midpoint =
                rect.left + rect.width / 2;

            if (clientX < midpoint) {
                return Number(card.dataset.slotIndex) - 1;
            }
        }

        if (otherCards.length === 0) {
            return dragState.fromIndex;
        }

        const lastCard =
            otherCards[otherCards.length - 1];

        return Number(lastCard.dataset.slotIndex) - 1;
    }

    function applyDragPreview(fromIndex, toIndex) {
        getCards().forEach(card => {
            const index =
                Number(card.dataset.slotIndex) - 1;

            let order = index;

            if (card === dragState?.card) {
                order = toIndex;
            } else if (fromIndex < toIndex) {
                if (index > fromIndex && index <= toIndex) {
                    order = index - 1;
                }
            } else if (fromIndex > toIndex) {
                if (index >= toIndex && index < fromIndex) {
                    order = index + 1;
                }
            }

            card.style.order = String(order);
            card.style.transform = "";
            card.classList.toggle(
                "build-card--drop-target",
                index === toIndex &&
                    card !== dragState?.card
            );
        });
    }

    function clearDragState() {
        if (dragState?.clone) {
            dragState.clone.remove();
        }

        dragState = null;
        isActionbarDragging = false;
        buildList.classList.remove("actionbar--dragging");

        getCards().forEach(card => {
            card.classList.remove(
                "build-card--dragging",
                "build-card--preview-hidden",
                "build-card--drop-target"
            );
            card.style.transform = "";
            card.style.order = "";

            if (card.dataset.pointerId) {
                card.releasePointerCapture?.(
                    Number(card.dataset.pointerId)
                );
                delete card.dataset.pointerId;
            }
        });
    }

    function finishDrag(card) {
        if (!dragState || dragState.card !== card) {
            return;
        }

        const fromIndex =
            dragState.fromIndex;

        const previewIndex =
            dragState.previewIndex;

        clearDragState();

        if (
            fromIndex === previewIndex ||
            !Number.isFinite(fromIndex) ||
            !Number.isFinite(previewIndex)
        ) {
            return;
        }

        if (
            !moveSpellInRotation(fromIndex, previewIndex)
        ) {
            return;
        }

        onRotationChange();

        buildList.classList.add("actionbar--reordered");

        window.setTimeout(() => {
            buildList.classList.remove(
                "actionbar--reordered"
            );
        }, 420);
    }

    getCards().forEach(card => {
        card.draggable = false;

        if (!canReorder()) {
            return;
        }

        card.addEventListener("pointerdown", event => {
            if (!canReorder() || event.button !== 0) {
                return;
            }

            const fromIndex =
                Number(card.dataset.slotIndex) - 1;

            if (
                !Number.isFinite(fromIndex) ||
                fromIndex < 0 ||
                fromIndex >= selectedSpells.length ||
                !selectedSpells[fromIndex]
            ) {
                return;
            }

            const rect =
                card.getBoundingClientRect();

            const clone =
                card.cloneNode(true);

            clone.classList.add("build-card--floating");
            clone.style.width = `${rect.width}px`;
            document.body.appendChild(clone);

            dragState = {
                card,
                clone,
                fromIndex,
                previewIndex: fromIndex,
                offsetX: event.clientX - rect.left,
                offsetY: event.clientY - rect.top
            };

            card.dataset.pointerId =
                String(event.pointerId);

            isActionbarDragging = true;
            card.classList.add(
                "build-card--dragging",
                "build-card--preview-hidden"
            );
            buildList.classList.add("actionbar--dragging");
            hideSpellTooltip();
            card.setPointerCapture(event.pointerId);
            moveFloatingCard(event);
            applyDragPreview(fromIndex, fromIndex);
            event.preventDefault();
        });

        card.addEventListener("pointermove", event => {
            if (!dragState || dragState.card !== card) {
                return;
            }

            moveFloatingCard(event);

            const previewIndex =
                getDropIndexFromPointer(event.clientX);

            if (previewIndex === dragState.previewIndex) {
                return;
            }

            dragState.previewIndex = previewIndex;
            applyDragPreview(
                dragState.fromIndex,
                previewIndex
            );
        });

        card.addEventListener("pointerup", () => {
            finishDrag(card);
        });

        card.addEventListener("pointercancel", () => {
            if (dragState?.card === card) {
                clearDragState();
            }
        });
    });
}

function renderBuildCard(slot, spellRanks, isActive, options = {}) {
    const spell =
        slot.spell;

    const showCombatMeta =
        options.showCombatMeta !== false;

    const card = document.createElement("div");
    card.classList.add(
        "build-card",
        getRarityView(spell.rarity).className
    );
    card.dataset.spellId = spell.id;
    card.dataset.slotId = slot.slotId;
    card.dataset.slotIndex = slot.slotIndex;

    if (isActive) {
        card.classList.add("build-card--active");
    }

    const combatMetaHtml =
        showCombatMeta
            ? `
                <div class="card-meta">
                    <span class="spell-rank">
                        ${romanize(spellRanks[spell.id])}
                    </span>
                </div>
                <div class="spell-status">
                    Bereit
                </div>
            `
            : `
                <div class="card-meta card-meta--readonly">
                    <span class="spell-rank">
                        ${romanize(spellRanks[spell.id])}
                    </span>
                </div>
            `;

    card.innerHTML = `
        ${renderSpellIconHtml(spell)}
        ${combatMetaHtml}
        <span class="sr-only">${spell.name}</span>
    `;

    card.tabIndex = 0;

    bindSpellIcons(card);

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
        updateActiveSpellCard("", false);

        if (onComplete) {
            onComplete();
        }

        return;
    }

    const moment =
        moments[index];

    const previousMoment =
        index > 0
            ? moments[index - 1]
            : null;

    const flow =
        getCombatMomentFlow(moment, previousMoment);

    if (flow.skip) {
        playCombatMoment(
            result,
            moments,
            index + 1,
            onComplete
        );

        return;
    }

    const action =
        getMomentPrimaryAction(moment);

    const schedule =
        (delay, callback) => {
            window.setTimeout(callback, delay);
        };

    schedule(flow.actorSwitchPause, () => {
        updateActiveSpellCard(moment.spellName, true);
        clearCombatFeedbackFade();
        renderActionFeedback(moment);
        appendCombatLogMoment(moment);

        const finishMoment = () => {
            updateCombatBars(moment);
            updateCombatClarity(moment);

            schedule(flow.afterBars, () => {
                fadeOutCombatFeedback();

                schedule(
                    flow.microPause + COMBAT_FLOW_TIMINGS.feedbackFade,
                    () => {
                        playCombatMoment(
                            result,
                            moments,
                            index + 1,
                            onComplete
                        );
                    }
                );
            });
        };

        const runImpactPresentation = () => {
            let impactPresentationDone = false;

            const presentImpact = () => {
                if (impactPresentationDone) {
                    return;
                }

                impactPresentationDone = true;
                renderFloatingImpact(action);
                triggerTargetImpactForAction(action);

                schedule(flow.impactRead, finishMoment);
            };

            const impactFallbackMs =
                estimateCombatVfxImpactDelay(moment, action, previousMoment) + 120;

            const impactFallbackTimer =
                window.setTimeout(presentImpact, impactFallbackMs);

            playVfxForCombatMoment(
                moment,
                action,
                {
                    onImpact: () => {
                        window.clearTimeout(impactFallbackTimer);
                        presentImpact();
                    }
                },
                previousMoment
            );
        };

        if (flow.showImpact && flow.startVfxOnFeedback) {
            schedule(flow.beforeImpact, runImpactPresentation);
        }

        schedule(flow.feedbackRead, () => {
            if (!flow.showImpact) {
                finishMoment();
                return;
            }

            if (!flow.startVfxOnFeedback) {
                schedule(flow.beforeImpact, runImpactPresentation);
            }
        });
    });
}

function getMomentPrimaryAction(moment) {
    return moment.actions?.[0] || moment;
}

function getMomentActor(moment) {
    const action =
        getMomentPrimaryAction(moment);

    if (
        action.type === "enemyAttack" ||
        (
            action.actor &&
            action.actor !== "Spieler" &&
            action.actor !== "Echo"
        )
    ) {
        return "enemy";
    }

    if (
        action.type === "round" ||
        action.type === "separator"
    ) {
        return "neutral";
    }

    return "player";
}

function getCombatMomentFlow(moment, previousMoment) {
    const action =
        getMomentPrimaryAction(moment);

    const hasImpact =
        getActionImpact(action) !== "";

    const previousActor =
        previousMoment
            ? getMomentActor(previousMoment)
            : null;

    const currentActor =
        getMomentActor(moment);

    const actorSwitchPause =
        previousActor &&
        currentActor !== "neutral" &&
        previousActor !== "neutral" &&
        previousActor !== currentActor
            ? COMBAT_FLOW_TIMINGS.actorSwitchPause
            : 0;

    if (moment.type === "separator") {
        return { skip: true };
    }

    if (moment.type === "round") {
        return {
            skip: false,
            actorSwitchPause,
            feedbackRead:
                COMBAT_FLOW_TIMINGS.feedbackReadMinor,
            showImpact: false,
            beforeImpact: 0,
            impactRead: 0,
            afterBars: 80,
            microPause: 60
        };
    }

    let feedbackRead =
        COMBAT_FLOW_TIMINGS.feedbackRead;

    let impactRead =
        COMBAT_FLOW_TIMINGS.impactRead;

    if (isFollowUpCombatAction(action)) {
        feedbackRead =
            COMBAT_FLOW_TIMINGS.feedbackReadFollowUp;

        impactRead =
            COMBAT_FLOW_TIMINGS.impactReadFollowUp;
    } else if (!hasImpact) {
        feedbackRead = 260;
    }

    if (moment.importance === "important") {
        feedbackRead += 70;
        impactRead += 50;
    }

    return applySpellCombatTimingOverrides(
        {
            skip: false,
            actorSwitchPause,
            feedbackRead,
            showImpact: hasImpact,
            beforeImpact:
                hasImpact
                    ? COMBAT_FLOW_TIMINGS.beforeImpact
                    : 0,
            impactRead:
                hasImpact
                    ? impactRead
                    : 0,
            afterBars:
                COMBAT_FLOW_TIMINGS.afterBars,
            microPause:
                COMBAT_FLOW_TIMINGS.microPause,
            startVfxOnFeedback: false
        },
        moment
    );
}

function applySpellCombatTimingOverrides(flow, moment) {
    const feedbackView =
        getCombatFeedbackView(moment);

    const spellId =
        feedbackView.spellId;

    const vfxDefinition =
        spellId &&
        typeof VFX_SPELL_DEFINITIONS !== "undefined"
            ? VFX_SPELL_DEFINITIONS[spellId]
            : null;

    const timing =
        vfxDefinition?.combatTiming;

    if (!timing) {
        return flow;
    }

    return {
        ...flow,
        feedbackRead:
            timing.feedbackRead ?? flow.feedbackRead,
        beforeImpact:
            timing.beforeImpact ?? flow.beforeImpact,
        impactRead:
            timing.impactRead ?? flow.impactRead,
        startVfxOnFeedback:
            timing.startVfxOnFeedback ?? flow.startVfxOnFeedback
    };
}

function clearCombatFeedbackFade() {
    const popup =
        document.getElementById("actionPopup");

    popup?.classList.remove("action-popup--fade-out");
}

function fadeOutCombatFeedback() {
    const popup =
        document.getElementById("actionPopup");

    if (!popup) {
        return;
    }

    popup.classList.remove("action-popup--pulse");
    popup.classList.add("action-popup--fade-out");
}

function renderFloatingImpact(action) {
    const impact =
        getActionImpact(action);

    const target =
        getImpactTarget(action);

    if (!impact || !target) {
        return;
    }

    if (isShieldGainCombatAction(action)) {
        playPortraitShieldRise(target);
    }

    renderFloatingNumber(
        target,
        impact,
        getImpactClass(action, impact)
    );
}

function triggerTargetImpactForAction(action) {
    const impact =
        getActionImpact(action);

    if (!impact || !isDamageImpact(action)) {
        return;
    }

    const target =
        getImpactTarget(action);

    if (!target) {
        return;
    }

    triggerTargetImpact(target);
}

function createCombatMoments(actions) {
    const moments = [];

    actions.forEach(action => {
        if (action.type === "separator") {
            return;
        }

        moments.push({
            ...action,
            actions: [action]
        });
    });

    return moments;
}

function isFollowUpCombatAction(action) {
    return action.effectText === "Folgetreffer";
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
    const popup =
        document.getElementById("actionPopup");

    const icon =
        document.getElementById("combatFeedbackIcon");

    const actor =
        document.getElementById("combatFeedbackActor");

    const title =
        document.getElementById("combatFeedbackTitle");

    const detail =
        document.getElementById("combatFeedbackDetail");

    const impact =
        document.getElementById("combatFeedbackImpact");

    if (!popup || !icon || !actor || !title || !detail || !impact) {
        return;
    }

    const view =
        getCombatFeedbackView(action);

    if (view.spellId) {
        const spell =
            getSpellById(view.spellId);

        if (spell) {
            icon.innerHTML =
                renderSpellIconHtml(spell);

            bindSpellIcons(icon);
            icon.hidden = false;
        } else {
            icon.innerHTML = "";
            icon.hidden = true;
        }
    } else if (view.iconKey) {
        icon.innerHTML =
            renderEnemyActionIconHtml(
                {
                    id: view.iconKey,
                    name: view.actionName,
                    iconKey: view.iconKey
                },
                { popupSize: true }
            );

        bindSpellIcons(icon);
        icon.hidden = false;
    } else {
        icon.innerHTML = "";
        icon.hidden = true;
    }

    title.textContent =
        view.actionName || "-";

    impact.textContent =
        view.impact || "";

    detail.textContent =
        view.detail || "";

    actor.textContent =
        view.subtitle || "";

    popup.hidden = false;
    popup.classList.remove(
        "action-popup--pulse",
        "action-popup--fade-out"
    );
    void popup.offsetWidth;
    popup.classList.add("action-popup--pulse");
}

function getCombatFeedbackView(moment) {
    const actions =
        moment.actions || [moment];

    const spellId =
        moment.spellName ||
        actions.find(action => action.spellName)?.spellName ||
        "";

    const iconKey =
        moment.iconKey ||
        actions.find(action => action.iconKey)?.iconKey ||
        "";

    return {
        spellId,
        iconKey,
        subtitle: getAnnouncerSubtitle(moment),
        actionName: getMomentActionName(moment),
        detail: getAnnouncerDetail(actions),
        impact: getAnnouncerImpact(actions)
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
    if (moment.spellName) {
        const spell =
            getSpellById(moment.spellName);

        if (spell) {
            return spell.name;
        }
    }

    if (moment.actionName) {
        return moment.actionName;
    }

    if (moment.type === "enemyAttack") {
        return moment.feedbackTitle.replace(" greift an", "") || "Angriff";
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

function getAnnouncerImpact(actions) {
    const impactAction =
        actions.find(action => getActionImpact(action) !== "");

    return impactAction
        ? getActionImpact(impactAction)
        : "";
}

function renderFloatingImpacts(moment) {
    const actions =
        moment.actions || [moment];

    actions.forEach((action, index) => {
        window.setTimeout(() => {
            renderFloatingImpact(action);
            triggerTargetImpactForAction(action);
        }, index * COMBAT_FLOW_TIMINGS.beforeImpact);
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
            ? hpFill.closest(".hp-bar")
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

    if (action.effectText === "Kritischer Treffer") {
        return "floating-number--crit";
    }

    return "floating-number--damage";
}

function renderFloatingNumber(target, value, className) {
    const layer =
        document.getElementById(`${target}FloatingNumbers`);

    if (!layer) {
        return;
    }

    const stackIndex =
        layer.querySelectorAll(".floating-number").length;

    const number =
        document.createElement("div");

    number.classList.add(
        "floating-number",
        className
    );

    number.textContent = value;
    number.style.bottom =
        `${stackIndex * 34}px`;

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
                `<div class="combat-log-entry combat-log-entry--round"><strong>${action.message}</strong></div>`
            );
        } else {
            combatLog.insertAdjacentHTML(
                "beforeend",
                renderCombatLogEntry(action)
            );
        }
    });

    combatLog.scrollTop =
        combatLog.scrollHeight;
}

function renderCombatLogEntry(action) {
    return `
        <div class="combat-log-entry combat-log-entry--${getCombatLogType(action)}">
            <span class="combat-log-actor">${getCombatLogActor(action)}</span>
            <span class="combat-log-message">${action.message}</span>
        </div>
    `;
}

function getCombatLogType(action) {
    if (action.type === "buff") {
        return "buff";
    }

    if (action.type === "debuff") {
        return "debuff";
    }

    if (action.type === "shield") {
        return "shield";
    }

    if (action.actor === "Spieler" || action.spellName) {
        return "player";
    }

    if (action.type === "enemyAttack" || action.actor) {
        return "enemy";
    }

    return "default";
}

function getCombatLogActor(action) {
    if (action.actor) {
        return action.actor;
    }

    if (action.spellName) {
        return "Spieler";
    }

    return action.type || "Log";
}

function setupSpellTooltips(spellsForTooltip, selector, getRank, options = {}) {
    const tooltip =
        document.getElementById("spellTooltip");

    if (!tooltip) {
        return;
    }

    bindSpellTooltipHover();

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
                () => {
                    if (isActionbarDragging) {
                        return;
                    }

                    cancelSpellTooltipHide();
                    showSpellTooltip(spell, getRank(spell), options);
                }
            );

            card.addEventListener(
                "focus",
                () => {
                    if (isActionbarDragging) {
                        return;
                    }

                    cancelSpellTooltipHide();
                    showSpellTooltip(spell, getRank(spell), options);
                }
            );

            card.addEventListener(
                "click",
                () => {
                    if (isActionbarDragging) {
                        return;
                    }

                    cancelSpellTooltipHide();
                    showSpellTooltip(spell, getRank(spell), options);
                }
            );

            card.addEventListener(
                "mouseleave",
                scheduleSpellTooltipHide
            );

            card.addEventListener(
                "blur",
                scheduleSpellTooltipHide
            );
        });
}

function showSpellTooltip(spell, rankOrProgress, options = {}) {
    if (isActionbarDragging) {
        return;
    }

    const tooltip =
        document.getElementById("spellTooltip");

    if (!tooltip) {
        return;
    }

    const progress =
        typeof rankOrProgress === "object"
            ? rankOrProgress
            : {
                rank: rankOrProgress || getSpellRank(spell.id),
                path: getSpellPath(spell.id)
            };

    const view =
        getSpellTooltipView(
            spell,
            progress.rank,
            progress.path,
            options
        );

    tooltip.innerHTML = `
        <div class="tooltip-header">
            ${renderSpellIconHtml(spell)}
            <div class="tooltip-header-text">
                <div class="tooltip-title">
                    ${view.name}
                </div>
            </div>
        </div>
        <div class="tooltip-rarity ${view.rarity.className}">
            [${view.rarity.label}]
        </div>
        <div class="tooltip-school">
            ${view.schoolLabel}
        </div>
        ${view.description
            ? `<div class="tooltip-description">${view.description}</div>`
            : ""}
        <div class="tooltip-section-label">Effekt</div>
        ${renderTooltipValueLines(view.valueLines)}
        ${view.showRank
            ? `<div class="tooltip-rank">Rang ${view.rankLabel}</div>`
            : ""}
        ${view.pathLabel
            ? `<div class="tooltip-specialization">Spezialisierung: ${view.pathLabel}</div>`
            : ""}
        ${renderTooltipUpgradePreview(view.upgradePreview)}
    `;

    bindSpellIcons(tooltip);
    tooltip.hidden = false;
}

function renderTooltipUpgradePreview(preview) {
    if (!preview) {
        return "";
    }

    const hasRank3 =
        preview.rank3?.length > 0;

    const hasRank5 =
        preview.rank5?.length > 0;

    if (!hasRank3 && !hasRank5) {
        return "";
    }

    return `
        <div class="tooltip-upgrades">
            <div class="tooltip-section-label">Weitere Entwicklung</div>
            ${hasRank3
                ? renderTooltipUpgradeRank("Rang III", preview.rank3)
                : ""}
            ${hasRank5
                ? renderTooltipUpgradeRank("Rang V", preview.rank5)
                : ""}
        </div>
    `;
}

function renderTooltipUpgradeRank(rankTitle, entries) {
    return `
        <div class="tooltip-upgrade-rank">
            <div class="tooltip-upgrade-rank-title">${rankTitle}</div>
            ${entries.map(entry => `
                <div class="tooltip-upgrade-entry">
                    ${entry.label
                        ? `<div class="tooltip-upgrade-path">${entry.label}</div>`
                        : ""}
                    ${renderTooltipLines(
                        (entry.lines || []).map(enrichTooltipText)
                    )}
                </div>
            `).join("")}
        </div>
    `;
}

function renderTooltipValueLines(lines) {
    if (!lines || lines.length === 0) {
        return "";
    }

    return `
        <div class="tooltip-section tooltip-section--values">
            ${renderTooltipLines(lines)}
        </div>
    `;
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

function renderTooltipSections(sections) {
    if (!sections) {
        return "";
    }

    const sectionGroups = [
        {
            lines: sections.direct,
            className: "tooltip-section tooltip-section--direct"
        },
        {
            lines: sections.additional,
            className: "tooltip-section tooltip-section--additional"
        },
        {
            lines: sections.conditional,
            className: "tooltip-section tooltip-section--conditional"
        },
        {
            lines: sections.special,
            className: "tooltip-section tooltip-section--special"
        }
    ];

    return sectionGroups
        .filter(group => group.lines.length > 0)
        .map(group => `
            <div class="${group.className}">
                ${renderTooltipLines(group.lines)}
            </div>
        `)
        .join("");
}

function renderReadonlyBuildList(actionbarSlots, spellRanks) {
    const buildList =
        document.getElementById("rewardBuildList");

    if (!buildList) {
        return;
    }

    buildList.innerHTML = "";

    const spells =
        [];

    actionbarSlots.forEach(slot => {
        if (slot.spell) {
            spells.push(slot.spell);
            buildList.appendChild(
                renderBuildCard(
                    slot,
                    spellRanks,
                    false,
                    { showCombatMeta: false }
                )
            );
            return;
        }

        buildList.appendChild(renderEmptyBuildCard(slot));
    });

    buildList
        .querySelectorAll(".build-card")
        .forEach(card => {
            card.draggable = false;
            card.style.cursor = "default";
        });

    setupSpellTooltips(
        spells,
        "#rewardBuildList .build-card:not(.build-card--empty)",
        spell => getSpellProgress(spell.id)
    );
}

function hideSpellTooltip() {
    cancelSpellTooltipHide();

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

function updateCombatClarity(action) {
    updatePortraitVulnerableOverlays(action);
    updatePortraitShieldOverlays(action);
    updatePortraitPrecisionOverlay(action);
    updatePlayerResistanceBadge(action);
    updateEnemyIntent(action.enemyActionBar);
}

function updateEnemyIntent(actionBar) {
    const actionBarElement =
        document.getElementById("enemyActionBar");

    if (!actionBarElement) {
        return;
    }

    if (!actionBar?.length) {
        actionBarElement.innerHTML = `
            <div class="enemy-action-timeline__empty">
                Keine Aktionen bekannt.
            </div>
        `;
        return;
    }

    actionBarElement.innerHTML =
        renderEnemyActionTimeline(actionBar);

    bindSpellIcons(actionBarElement);
}

function updateStatusRow(rowId, statuses) {
    const row =
        document.getElementById(rowId);

    if (!row) {
        return;
    }

    row.innerHTML =
        renderStatusChips(statuses);
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

    const shieldRawPercent =
        getPercent(shieldValue || 0, maxValue);

    const shieldVisiblePercent =
        Math.min(shieldRawPercent, hpPercent);

    const shieldLeftPercent =
        hpPercent - shieldVisiblePercent;

    fill.style.width =
        `${hpPercent}%`;

    shield.style.left =
        `${shieldLeftPercent}%`;

    shield.style.width =
        `${shieldVisiblePercent}%`;

    text.textContent =
        shieldValue > 0
            ? `${value} / ${maxValue} HP | ${shieldValue} Schild`
            : `${value} / ${maxValue} HP`;
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

            <button
                id="restartButton"
                class="btn btn-primary"
            >
                Neue Reise beginnen
            </button>
        `;

        renderActionFeedback({
            feedbackTitle: "Niederlage",
            feedbackDetail: "Deine Reise endet hier"
        });
    }

    combatLog.scrollTop =
        combatLog.scrollHeight;

    renderCombatOutcomeOverlay(result);
}

function removeCombatOutcomeOverlay() {
    const existingOverlay =
        document.getElementById("combatOutcomeOverlay");

    if (existingOverlay) {
        existingOverlay.remove();
    }
}

function renderCombatOutcomeOverlay(result) {
    removeCombatOutcomeOverlay();

    const overlay =
        document.createElement("div");

    overlay.id = "combatOutcomeOverlay";
    overlay.classList.add("combat-outcome-overlay");

    if (result.victory) {
        const enemyName =
            result.enemyName
                ? escapeHtml(result.enemyName)
                : "Der Gegner";

        overlay.innerHTML = `
            <div class="combat-outcome-panel combat-outcome-panel--victory">
                <button
                    id="combatOutcomeDismiss"
                    class="combat-outcome-dismiss"
                    type="button"
                    aria-label="Schließen"
                >
                    ✕
                </button>
                <h2 class="combat-outcome-title combat-outcome-title--victory">
                    Sieg!
                </h2>
                <p class="combat-outcome-subtitle">
                    ${enemyName} wurde besiegt. Glückwunsch!
                </p>
                <button
                    id="overlayRewardButton"
                    class="btn btn-primary combat-outcome-cta"
                >
                    Belohnung wählen
                </button>
            </div>
        `;
    } else {
        overlay.innerHTML = `
            <div class="combat-outcome-panel combat-outcome-panel--defeat">
                <h2 class="combat-outcome-title combat-outcome-title--defeat">
                    Deine Reise endet hier
                </h2>
                <p class="combat-outcome-subtitle">
                    Doch jede Niederlage ist nur der Auftakt einer neuen Geschichte.
                </p>
                <button
                    id="overlayRestartButton"
                    class="btn btn-primary combat-outcome-cta"
                >
                    Neue Reise beginnen
                </button>
            </div>
        `;
    }

    document.body.appendChild(overlay);

    if (result.victory) {
        const dismissButton =
            overlay.querySelector("#combatOutcomeDismiss");

        dismissButton.addEventListener(
            "click",
            removeCombatOutcomeOverlay
        );

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                removeCombatOutcomeOverlay();
            }
        });
    }

    window.requestAnimationFrame(() => {
        overlay.classList.add("combat-outcome-overlay--visible");
    });

    return overlay;
}

function renderRewardScreen() {
    getGameRoot().innerHTML = `
        <div class="screen screen-reward">

            <h2 class="screen-title">
                Wähle eine Belohnung
            </h2>

            <section class="reward-build-panel">
                <h3 class="reward-build-title">
                    Dein Build
                </h3>
                <p class="reward-build-hint">
                    Zauber überfahren, um Details zu sehen
                </p>
                <div
                    id="rewardBuildList"
                    class="actionbar actionbar--readonly actionbar--reward"
                ></div>
            </section>

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

            <div
                id="spellTooltip"
                class="spell-tooltip"
                hidden
            ></div>

        </div>
    `;
}

function renderRewardCard(option, spellRanks) {
    if (option.type === "path_choice") {
        return renderPathChoiceRewardCard(option, spellRanks);
    }

    const isUpgrade =
        option.type === "upgrade";

    const startRank =
        option.startRank || 1;

    const currentRank =
        isUpgrade
            ? (spellRanks[option.spell.id] || 1)
            : startRank;

    const rewardView =
        isUpgrade
            ? getSpellRewardView(
                option.spell,
                currentRank,
                option
            )
            : getSpellTooltipView(option.spell, startRank);

    const newSpellRankLabel =
        romanize(startRank);

    const rewardBadgeHtml = `
        <span class="reward-badge ${
            isUpgrade
                ? "reward-badge--upgrade"
                : "reward-badge--new"
        }">
            ${isUpgrade
                ? "Upgrade"
                : startRank > 1
                    ? `Neuer Zauber · Rang ${newSpellRankLabel}`
                    : "Neuer Zauber"}
        </span>
        ${isUpgrade && rewardView.rankProgressLabel
            ? `<div class="reward-rank-progress">${rewardView.rankProgressLabel}</div>`
            : ""}
        ${!isUpgrade && startRank > 1
            ? `<div class="reward-rank-progress">Startet auf Rang ${newSpellRankLabel}</div>`
            : ""}
    `;

    const rewardChangeHtml = `
        <div class="reward-change-list">
            ${renderRewardChangeLines(rewardView.changeLines || [])}
        </div>
    `;

    const card =
        renderSpellCard(
            option.spell,
            isUpgrade ? rewardView.rank : startRank,
            {
                classNames: [
                    "reward-card",
                    isUpgrade
                        ? "reward-card--upgrade"
                        : "reward-card--new"
                ],
                variant: "reward",
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
            `${option.spell.name} ${newSpellRankLabel}`;
    }

    return {
        card,
        text
    };
}

function renderPathChoiceRewardCard(option, spellRanks) {
    const slot =
        document.createElement("div");

    slot.classList.add(
        "reward-path-choice",
        "reward-card"
    );

    slot.dataset.spellId =
        option.spell.id;

    const currentRank =
        spellRanks[option.spell.id] || (PATH_CHOICE_RANK - 1);

    const header =
        document.createElement("div");

    header.classList.add("reward-path-choice-header");
    header.innerHTML = `
        <span class="reward-badge reward-badge--upgrade">
            Entwicklungspfad
        </span>
        <div class="reward-path-choice-title">
            ${option.spell.name}
        </div>
        <div class="reward-rank-progress">
            Rang ${romanize(currentRank)} → ${romanize(PATH_CHOICE_RANK)}
        </div>
    `;

    slot.appendChild(header);

    const scrollHost =
        document.createElement("div");

    scrollHost.classList.add("reward-card-scroll");

    const choicesHost =
        document.createElement("div");

    choicesHost.classList.add("reward-path-choice-options");

    const pathCards =
        (option.pathChoices || []).map(pathChoice => {
            const choiceButton =
                document.createElement("button");

            choiceButton.type = "button";
            choiceButton.classList.add("reward-path-choice-option");
            choiceButton.dataset.path =
                pathChoice.path;

            choiceButton.innerHTML = `
                <span class="reward-path-choice-label">
                    Pfad ${pathChoice.path.toUpperCase()}: ${pathChoice.label}
                </span>
                <span class="reward-path-choice-detail">
                    ${renderRewardChangeLines(
                        pathChoice.changeLines?.length
                            ? pathChoice.changeLines.map(enrichTooltipText)
                            : (pathChoice.tooltip || []).map(enrichTooltipText)
                    )}
                </span>
            `;

            choicesHost.appendChild(choiceButton);

            return choiceButton;
        });

    scrollHost.appendChild(choicesHost);
    slot.appendChild(scrollHost);

    return {
        card: slot,
        text: `${option.spell.name} ${romanize(PATH_CHOICE_RANK)}`,
        pathCards
    };
}

function renderRewardSlot(option, spellRanks) {
    const rewardCard =
        renderRewardCard(option, spellRanks);

    const slot =
        document.createElement("div");

    slot.classList.add("reward-slot", "reward-slot--enter");

    const cardHost =
        document.createElement("div");

    cardHost.classList.add("reward-slot-card");
    cardHost.appendChild(rewardCard.card);

    const rerollButton =
        document.createElement("button");

    rerollButton.type = "button";
    rerollButton.classList.add("reward-reroll-btn");
    rerollButton.setAttribute(
        "aria-label",
        "Diese Belohnung neu würfeln"
    );
    rerollButton.textContent = "↻";

    slot.appendChild(cardHost);
    slot.appendChild(rerollButton);

    return {
        slot,
        card: rewardCard.card,
        cardHost,
        rerollButton,
        text: rewardCard.text,
        pathCards: rewardCard.pathCards || null
    };
}

function animateRewardSlotReroll(
    cardHost,
    newCard,
    onComplete
) {
    cardHost.classList.add("reward-card--reroll-out");

    window.setTimeout(() => {
        cardHost.innerHTML = "";
        cardHost.appendChild(newCard);
        cardHost.classList.remove("reward-card--reroll-out");
        cardHost.classList.add("reward-card--reroll-in");

        window.setTimeout(() => {
            cardHost.classList.remove("reward-card--reroll-in");

            if (typeof onComplete === "function") {
                onComplete();
            }
        }, 420);
    }, 220);
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

        <p class="subtitle">
            Du hast alle Gegner besiegt. Eine neue Reise wartet bereits.
        </p>

        <div class="screen-actions">
            <button
                id="backToHomeButton"
                class="btn btn-primary"
            >
                Zurück zum Hauptmenü
            </button>
        </div>
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
