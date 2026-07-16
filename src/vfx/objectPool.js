const VFX_POOL_MAX_SIZE = 200;

const vfxPools = {};

function getVfxPool(poolKey, factory) {
    if (!vfxPools[poolKey]) {
        vfxPools[poolKey] = {
            factory,
            free: [],
            active: new Set()
        };
    }

    return vfxPools[poolKey];
}

function acquireVfxPoolItem(poolKey, factory) {
    const pool =
        getVfxPool(poolKey, factory);

    const item =
        pool.free.pop() || pool.factory();

    pool.active.add(item);

    if (typeof item.setVisible === "function") {
        item.setVisible(true);
    } else {
        item.visible = true;
        item.alpha = 1;
    }

    return item;
}

function releaseVfxPoolItem(poolKey, item) {
    const pool =
        vfxPools[poolKey];

    if (!pool || !pool.active.has(item)) {
        return;
    }

    pool.active.delete(item);

    if (item.parent) {
        item.parent.removeChild(item);
    }

    if (pool.free.length < VFX_POOL_MAX_SIZE) {
        pool.free.push(item);
    } else if (typeof item.destroy === "function") {
        item.destroy();
    }
}

function resetVfxPools() {
    Object.keys(vfxPools).forEach(poolKey => {
        const pool =
            vfxPools[poolKey];

        pool.active.forEach(item => {
            if (item.parent) {
                item.parent.removeChild(item);
            }
        });

        pool.active.clear();
        pool.free.length = 0;
    });
}
