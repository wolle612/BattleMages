const VFX_LAYER_NAMES = [
    "background",
    "cast",
    "projectile",
    "impact",
    "particle",
    "overlay"
];

let vfxLayers = null;

function initVfxLayers(pixiApp) {
    vfxLayers = {};

    VFX_LAYER_NAMES.forEach(layerName => {
        const layer =
            new PIXI.Container();

        layer.name = `vfx-layer-${layerName}`;

        pixiApp.stage.addChild(layer);

        vfxLayers[layerName] = layer;
    });

    return vfxLayers;
}

function getVfxLayer(layerName) {
    if (!vfxLayers) {
        return null;
    }

    return vfxLayers[layerName] || vfxLayers.overlay;
}

function clearVfxLayers() {
    if (!vfxLayers) {
        return;
    }

    VFX_LAYER_NAMES.forEach(layerName => {
        vfxLayers[layerName].removeChildren();
    });
}
