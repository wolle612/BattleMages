function applyVfxBlendMode(visual, blendModeKey) {
    if (!visual || !blendModeKey || typeof PIXI === "undefined") {
        return;
    }

    const mode =
        PIXI.BLEND_MODES?.[String(blendModeKey).toUpperCase()];

    if (mode !== undefined) {
        visual.blendMode = mode;
    }
}

function drawVfxCircleGraphic(visual, radius, color, alpha, filled) {
    if (typeof visual.circle === "function" && typeof visual.fill === "function") {
        visual.circle(0, 0, radius);

        if (filled) {
            visual.fill({ color, alpha });
        } else if (typeof visual.stroke === "function") {
            visual.stroke({ width: 3, color, alpha });
        }

        return;
    }

    if (filled) {
        visual.beginFill(color, alpha);
        visual.drawCircle(0, 0, radius);
        visual.endFill();
    } else {
        visual.lineStyle(3, color, alpha);
        visual.drawCircle(0, 0, radius);
    }
}

function createVfxTimeline() {
    const timers = [];

    let cancelled = false;

    function schedule(delay, callback) {
        if (cancelled) {
            return;
        }

        const timer =
            window.setTimeout(() => {
                if (!cancelled) {
                    callback();
                }
            }, Math.max(0, delay));

        timers.push(timer);
    }

    function cancel() {
        cancelled = true;

        timers.forEach(timer => window.clearTimeout(timer));
        timers.length = 0;
    }

    return {
        schedule,
        cancel
    };
}

function ensureVfxRendererActive() {
    // isVfxSupported() ist false, sobald disableVfxRendering() nach einem
    // WebGL-Fehler den Ticker angehalten hat. Ohne diesen Guard wuerde JEDER
    // nachfolgende Tween (runVfxTween) den Ticker hier ungeprueft wieder
    // starten und den kaputten Renderer erneut antriggern (Ursache des
    // "Cannot read properties of null (reading '_batchEnabled')"-Folgefehlers).
    if (!isVfxSupported()) {
        return null;
    }

    const pixiApp =
        ensureVfxPixiApp();

    if (!pixiApp) {
        return null;
    }

    mountVfxStage();
    resizeVfxStageToHost();

    if (pixiApp.ticker) {
        pixiApp.ticker.start();
    }

    return pixiApp;
}

function renderVfxFrame() {
    if (!isVfxSupported()) {
        return;
    }

    const pixiApp =
        ensureVfxPixiApp();

    if (!pixiApp?.renderer) {
        return;
    }

    try {
        pixiApp.render();
    } catch (error) {
        disableVfxRendering(
            error instanceof Error
                ? error.message
                : "WebGL-Renderfehler"
        );
    }
}

function runVfxTween(durationMs, onUpdate, onComplete) {
    ensureVfxRendererActive();

    const startedAt =
        performance.now();

    let cancelled = false;
    let frameId = 0;

    function tick(now) {
        if (cancelled) {
            return;
        }

        const elapsed =
            now - startedAt;

        const progress =
            durationMs > 0
                ? Math.min(1, elapsed / durationMs)
                : 1;

        onUpdate(progress);
        renderVfxFrame();

        if (progress >= 1) {
            if (onComplete) {
                onComplete();
            }

            return;
        }

        frameId =
            window.requestAnimationFrame(tick);
    }

    frameId =
        window.requestAnimationFrame(tick);

    return () => {
        cancelled = true;

        if (frameId) {
            window.cancelAnimationFrame(frameId);
        }
    };
}

function createVfxHandle(durationMs, cancelFn) {
    let cancelled = false;

    return {
        durationMs: durationMs || 0,
        cancel() {
            if (cancelled) {
                return;
            }

            cancelled = true;
            cancelFn();
        }
    };
}

function createNoopVfxHandle() {
    return {
        durationMs: 0,
        cancel() {}
    };
}

function destroyVfxDisplayObject(displayObject) {
    if (!displayObject) {
        return;
    }

    if (displayObject.parent) {
        displayObject.parent.removeChild(displayObject);
    }

    displayObject.destroy();
}
