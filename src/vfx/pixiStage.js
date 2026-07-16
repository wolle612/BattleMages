const VFX_ENABLED = true;

let vfxPixiApp = null;
let vfxCanvasHost = null;
let vfxResizeObserver = null;
let vfxFileProtocolWarningShown = false;
let vfxRenderDisabled = false;

function isVfxFileProtocol() {
    return window.location.protocol === "file:";
}

function hasVfxFileProtocolSupport() {
    return (
        typeof VFX_SPRITESHEET_TEXTURE_DATA !== "undefined" &&
        VFX_SPRITESHEET_TEXTURE_DATA !== null &&
        Object.keys(VFX_SPRITESHEET_TEXTURE_DATA).length > 0
    );
}

function warnVfxFileProtocolOnce() {
    if (vfxFileProtocolWarningShown) {
        return;
    }

    vfxFileProtocolWarningShown = true;

    console.warn(
        "[VFX] file:// ohne eingebettete Texturen. " +
        "Führe aus: py tools/sync_vfx_manifests_js.py " +
        "(oder nutze http://localhost mit py -m http.server 8765)"
    );
}

function isVfxSupported() {
    if (!VFX_ENABLED || typeof PIXI === "undefined") {
        return false;
    }

    if (isVfxFileProtocol() && !hasVfxFileProtocolSupport()) {
        warnVfxFileProtocolOnce();
    }

    return !vfxRenderDisabled;
}

function disableVfxRendering(reason) {
    if (vfxRenderDisabled) {
        return;
    }

    vfxRenderDisabled = true;

    if (vfxPixiApp?.ticker) {
        vfxPixiApp.ticker.stop();
    }

    console.warn(`[VFX] Rendering deaktiviert: ${reason}`);
}

function configureVfxPixiTextureLoader() {
    if (!VFX_ENABLED || typeof PIXI === "undefined") {
        return;
    }

    if (isVfxFileProtocol() && !hasVfxFileProtocolSupport()) {
        return;
    }

    if (PIXI.loadTextures?.config) {
        PIXI.loadTextures.config.preferWorkers = false;
        PIXI.loadTextures.config.preferCreateImageBitmap = false;

        if (!isVfxFileProtocol()) {
            PIXI.loadTextures.config.crossOrigin = "anonymous";
        }
    }

    if (typeof PIXI.Assets?.setPreferences === "function") {
        PIXI.Assets.setPreferences({
            preferWorkers: false,
            preferCreateImageBitmap: false
        });
    }
}

configureVfxPixiTextureLoader();

function ensureVfxPixiApp() {
    if (vfxPixiApp || !isVfxSupported()) {
        return vfxPixiApp;
    }

    vfxPixiApp = new PIXI.Application({
        backgroundAlpha: 0,
        antialias: false,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
        width: 1,
        height: 1
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    vfxPixiApp.stage.sortableChildren = true;

    vfxPixiApp.view.classList.add("vfx-canvas");
    vfxPixiApp.view.setAttribute("aria-hidden", "true");

    initVfxLayers(vfxPixiApp);

    if (vfxPixiApp.ticker) {
        vfxPixiApp.ticker.start();
    }

    return vfxPixiApp;
}

function getVfxCanvasElement() {
    return vfxPixiApp
        ? vfxPixiApp.view
        : null;
}

function resizeVfxStageToHost() {
    if (!vfxPixiApp || !vfxCanvasHost) {
        return;
    }

    const rect =
        vfxCanvasHost.getBoundingClientRect();

    vfxPixiApp.renderer.resize(
        Math.max(1, Math.round(rect.width)),
        Math.max(1, Math.round(rect.height))
    );
}

function mountVfxStage() {
    if (!isVfxSupported()) {
        return;
    }

    const host =
        document.querySelector(".battle-arena");

    if (!host) {
        return;
    }

    ensureVfxPixiApp();

    if (!vfxPixiApp) {
        return;
    }

    const canvas =
        vfxPixiApp.view;

    if (vfxCanvasHost === host) {
        if (canvas && !host.contains(canvas)) {
            host.appendChild(canvas);
        }

        resizeVfxStageToHost();
        return;
    }

    unmountVfxStage();

    host.appendChild(canvas);
    vfxCanvasHost = host;

    resizeVfxStageToHost();

    vfxResizeObserver =
        new ResizeObserver(() => resizeVfxStageToHost());

    vfxResizeObserver.observe(host);
}

function unmountVfxStage() {
    if (vfxResizeObserver) {
        vfxResizeObserver.disconnect();
        vfxResizeObserver = null;
    }

    if (vfxPixiApp && vfxPixiApp.view.parentNode) {
        vfxPixiApp.view.parentNode.removeChild(vfxPixiApp.view);
    }

    vfxCanvasHost = null;
}

function showVfxStage() {
    mountVfxStage();
}

function hideVfxStage() {
    unmountVfxStage();

    if (typeof resetEffectManager === "function") {
        resetEffectManager();
    }
}
