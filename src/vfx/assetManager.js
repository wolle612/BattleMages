let vfxPlaceholderTexture = null;
const vfxTextureCache = {};
const vfxSpritesheetCache = {};
const vfxSpritesheetLoadPromises = {};

function applyVfxNearestScale(texture) {
    if (texture && texture.baseTexture) {
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

    return texture;
}

function getVfxPlaceholderTexture() {
    if (vfxPlaceholderTexture) {
        return vfxPlaceholderTexture;
    }

    const pixiApp =
        ensureVfxPixiApp();

    if (!pixiApp) {
        return null;
    }

    const graphic =
        new PIXI.Graphics();

    graphic.beginFill(0xffffff, 0.55);
    graphic.drawCircle(0, 0, 12);
    graphic.endFill();

    vfxPlaceholderTexture =
        pixiApp.renderer.generateTexture(graphic);

    graphic.destroy();

    return vfxPlaceholderTexture;
}

// Leer bis die Schul-Bibliotheken vollständig integriert werden.
const VFX_CORE_SPRITESHEETS = [];

function formatVfxLoadError(error, context) {
    if (error instanceof Error && error.message) {
        return `${context}: ${error.message}`;
    }

    if (error && typeof error === "object" && error.width === 0 && error.height === 0) {
        return `${context}: Bild konnte nicht geladen werden (0x0 BaseTexture)`;
    }

    return `${context}: ${String(error)}`;
}

function loadVfxImageBaseTexture(imagePath) {
    if (!imagePath) {
        return Promise.reject(new Error("Missing image path"));
    }

    const imageUrl =
        resolveVfxImageSource(imagePath);

    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
            if (!image.width || !image.height) {
                reject(
                    new Error(
                        `Bild hat keine gültige Größe: ${imageUrl}`
                    )
                );
                return;
            }

            const baseTexture =
                PIXI.BaseTexture.from(image, {
                    scaleMode: PIXI.SCALE_MODES.NEAREST
                });

            applyVfxNearestScale(baseTexture);

            if (!baseTexture.valid) {
                reject(
                    new Error(
                        `BaseTexture ungültig nach Bildload: ${imageUrl}`
                    )
                );
                return;
            }

            resolve(baseTexture);
        };

        image.onerror = () => {
            reject(
                new Error(`Bild konnte nicht geladen werden: ${imageUrl}`)
            );
        };

        if (window.location.protocol !== "file:") {
            image.crossOrigin = "anonymous";
        }

        // imageUrl ist bereits ueber resolveVfxImageSource() aufgeloest
        // (data:-URI oder absolute URL) — NICHT erneut aufloesen: ein
        // zweiter new URL()-Durchlauf ueber eine data:-URI kann Base64-
        // Sonderzeichen (+, /, =) beschaedigen und die Textur unbrauchbar
        // machen.
        image.src = imageUrl;
    });
}

function waitForVfxBaseTexture(baseTexture) {
    if (!baseTexture) {
        return Promise.reject(new Error("Missing BaseTexture"));
    }

    if (baseTexture.valid) {
        return Promise.resolve(baseTexture);
    }

    return new Promise((resolve, reject) => {
        const finish = error => {
            baseTexture.off("loaded", onLoaded);
            baseTexture.off("error", onError);

            if (error) {
                reject(error);
                return;
            }

            if (baseTexture.valid) {
                resolve(baseTexture);
                return;
            }

            reject(new Error("BaseTexture failed to become valid"));
        };

        const onLoaded = () => finish(null);
        const onError = error =>
            finish(error || new Error("BaseTexture load error"));

        baseTexture.once("loaded", onLoaded);
        baseTexture.once("error", onError);
    });
}

let vfxCoreAssetsPromise = null;

function preloadVfxCoreAssets() {
    if (!isVfxSupported()) {
        return Promise.resolve();
    }

    if (!vfxCoreAssetsPromise) {
        // Alle Schul-Sprite-Sheets (Cast/Beam/Schnitt/Explosion/Impact) werden
        // EINMAL beim Spielstart geladen und gecacht. Waehrend des Kampfes
        // finden dadurch keine Nachladevorgaenge statt.
        const schoolManifests =
            typeof VFX_SCHOOL_SHEET_MANIFESTS !== "undefined"
                ? VFX_SCHOOL_SHEET_MANIFESTS
                : [];

        const manifestPaths =
            VFX_CORE_SPRITESHEETS.concat(schoolManifests);

        vfxCoreAssetsPromise =
            Promise.all(
                manifestPaths.map(path => loadVfxSpritesheet(path))
            );
    }

    return vfxCoreAssetsPromise;
}

function loadVfxTexture(assetPath) {
    if (!assetPath) {
        return getVfxPlaceholderTexture();
    }

    try {
        const texture =
            PIXI.Texture.from(resolveVfxAssetUrl(assetPath));

        applyVfxNearestScale(texture);

        texture.baseTexture.once("error", () => {
            console.warn(
                `[VFX] Textur konnte nicht geladen werden: ${assetPath}`
            );
        });

        return texture;
    } catch (error) {
        console.warn(
            `[VFX] Textur-Fehler bei ${assetPath}:`,
            error
        );

        return getVfxPlaceholderTexture();
    }
}

function resolveVfxAssetUrl(relativePath) {
    if (!relativePath) {
        return relativePath;
    }

    try {
        return new URL(relativePath, window.location.href).href;
    } catch (error) {
        return relativePath;
    }
}

function resolveVfxImageSource(relativeImagePath) {
    if (
        window.location.protocol === "file:" &&
        typeof VFX_SPRITESHEET_TEXTURE_DATA !== "undefined" &&
        VFX_SPRITESHEET_TEXTURE_DATA[relativeImagePath]
    ) {
        return VFX_SPRITESHEET_TEXTURE_DATA[relativeImagePath];
    }

    return resolveVfxAssetUrl(relativeImagePath);
}

function loadVfxManifest(manifestPath) {
    const inlineManifest =
        typeof VFX_SPRITESHEET_MANIFESTS !== "undefined"
            ? VFX_SPRITESHEET_MANIFESTS[manifestPath]
            : null;

    if (inlineManifest) {
        return Promise.resolve(inlineManifest);
    }

    if (window.location.protocol === "file:") {
        return Promise.reject(
            new Error(
                `Manifest ${manifestPath} fehlt in data/vfx/spritesheetManifests.js`
            )
        );
    }

    return fetch(resolveVfxAssetUrl(manifestPath)).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    });
}

function loadVfxSpritesheet(manifestPath) {
    if (!manifestPath) {
        return Promise.resolve(null);
    }

    if (vfxSpritesheetCache[manifestPath]) {
        return Promise.resolve(vfxSpritesheetCache[manifestPath]);
    }

    // vfxSpritesheetCache wird erst NACH dem asynchronen Laden befuellt --
    // ohne dieses zweite, sofort (synchron) gesetzte Promise-Cache wuerde
    // ein zweiter Aufruf fuer denselben Pfad, der eintrifft bevor der erste
    // fertig ist (z.B. zwei VFX-Impacts derselben Schule kurz hintereinander
    // im Kampf), das Manifest ein zweites Mal parsen -- PixiJS registriert
    // dieselben Frame-IDs dann doppelt in seinem globalen Texture-Cache
    // ("Texture added to the cache ... already had an entry").
    if (vfxSpritesheetLoadPromises[manifestPath]) {
        return vfxSpritesheetLoadPromises[manifestPath];
    }

    const loadPromise =
        loadVfxManifest(manifestPath)
            .then(async manifest => {
                const imagePath =
                    manifestPath.replace(/[^/]+$/, manifest.meta.image);

                const baseTexture =
                    await loadVfxImageBaseTexture(imagePath);

                const spritesheet =
                    new PIXI.Spritesheet(baseTexture, manifest);

                await spritesheet.parse();

                if (
                    !spritesheet.animations ||
                    Object.keys(spritesheet.animations).length === 0
                ) {
                    throw new Error(
                        `Spritesheet enthält keine Animationen: ${manifestPath}`
                    );
                }

                vfxSpritesheetCache[manifestPath] = spritesheet;

                return spritesheet;
            })
            .catch(error => {
                console.warn(
                    `[VFX] Spritesheet konnte nicht geladen werden: ${manifestPath} — ${formatVfxLoadError(error, "Ladefehler")}`
                );

                return null;
            })
            .finally(() => {
                delete vfxSpritesheetLoadPromises[manifestPath];
            });

    vfxSpritesheetLoadPromises[manifestPath] = loadPromise;

    return loadPromise;
}

function getVfxSpritesheetAnimation(manifestPath, animationName) {
    const spritesheet =
        vfxSpritesheetCache[manifestPath];

    if (!spritesheet || !spritesheet.animations[animationName]) {
        return null;
    }

    return spritesheet.animations[animationName];
}

function resetVfxAssetCache() {
    vfxCoreAssetsPromise = null;

    Object.keys(vfxSpritesheetCache).forEach(key => {
        const sheet = vfxSpritesheetCache[key];

        if (sheet.texture && sheet.texture.baseTexture) {
            sheet.texture.baseTexture.destroy();
        }

        delete vfxSpritesheetCache[key];
    });
}
