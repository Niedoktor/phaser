export const modules = {};

export const importModule = async (module) => {
    if (!modules[module.name]) {
        modules[module.name] = module;
    }
    return modules[module.name];
};

export const importBooster = async (path) => {
    const module = (await import(`./boosters/${path}.js`)).default;
    return await importModule(module);
};

export const importDevice = async (path) => {
    const module = (await import(`./devices/${path}.js`)).default;
    return await importModule(module);
};

export const importMine = async (path) => {
    const module = (await import(`./mines/${path}.js`)).default;
    return await importModule(module);
};
