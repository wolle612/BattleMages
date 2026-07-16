const VFX_CAMERA_SHAKE_CLASSES = {
    small: "battle-screen--vfx-shake-small",
    medium: "battle-screen--vfx-shake-medium",
    heavy: "battle-screen--vfx-shake-heavy"
};

const VFX_CAMERA_SHAKE_DURATIONS = {
    small: 220,
    medium: 260,
    heavy: 340
};

function getVfxCameraRoot() {
    return document.querySelector(".battle-screen");
}

function ensureVfxFlashOverlay(root) {
    let overlay =
        root.querySelector(".vfx-flash-overlay");

    if (!overlay) {
        overlay =
            document.createElement("div");

        overlay.className = "vfx-flash-overlay";
        overlay.setAttribute("aria-hidden", "true");

        root.appendChild(overlay);
    }

    return overlay;
}

function playCameraShake(tier) {
    const root =
        getVfxCameraRoot();

    const className =
        VFX_CAMERA_SHAKE_CLASSES[tier];

    if (!root || !className) {
        return;
    }

    root.classList.remove(
        VFX_CAMERA_SHAKE_CLASSES.small,
        VFX_CAMERA_SHAKE_CLASSES.medium,
        VFX_CAMERA_SHAKE_CLASSES.heavy
    );

    void root.offsetWidth;

    root.classList.add(className);

    window.setTimeout(() => {
        root.classList.remove(className);
    }, VFX_CAMERA_SHAKE_DURATIONS[tier] || 220);
}

function playCameraFlash() {
    const root =
        getVfxCameraRoot();

    if (!root) {
        return;
    }

    const overlay =
        ensureVfxFlashOverlay(root);

    overlay.classList.remove("vfx-flash-overlay--active");
    void overlay.offsetWidth;
    overlay.classList.add("vfx-flash-overlay--active");
}

function playCameraZoom(zoomConfig = {}) {
    const root =
        getVfxCameraRoot();

    if (!root) {
        return;
    }

    const duration =
        zoomConfig.duration || 260;

    root.classList.add("battle-screen--vfx-zoom");

    window.setTimeout(() => {
        root.classList.remove("battle-screen--vfx-zoom");
    }, duration);
}

function playCameraFreeze(freezeConfig = {}) {
    const duration =
        freezeConfig.duration || 90;

    const pixiApp =
        ensureVfxPixiApp();

    if (!pixiApp) {
        return;
    }

    pixiApp.ticker.stop();

    window.setTimeout(() => {
        pixiApp.ticker.start();
    }, duration);
}

function playCameraEffect(cameraDefinition) {
    if (!cameraDefinition) {
        return;
    }

    if (cameraDefinition.shake) {
        playCameraShake(cameraDefinition.shake);
    }

    if (cameraDefinition.flash) {
        playCameraFlash();
    }

    if (cameraDefinition.zoom) {
        playCameraZoom(
            typeof cameraDefinition.zoom === "object"
                ? cameraDefinition.zoom
                : {}
        );
    }

    if (cameraDefinition.freeze) {
        playCameraFreeze(
            typeof cameraDefinition.freeze === "object"
                ? cameraDefinition.freeze
                : {}
        );
    }
}
