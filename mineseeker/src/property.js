import { modules } from './modules';

const property = (obj, name, id, setCallback) => {
    let valType;

    if(!obj.properties) {
        obj.properties = [];
    }
    obj.properties.push({ name: name, id: id });

    Object.defineProperty(obj, name, {
        get: function () {
            let val = localStorage.getItem(id);
            valType = val ? val.split(':')[0] : 'undefined';
            val = val ? val.split(':')[1] : undefined;
            if (valType === 'number') {
                val = Number(val);
            }
            if(valType === 'boolean') {
                val = val === 'true';
            }
            if(valType === 'undefined') {
                val = undefined;
            }
            if(valType === 'module') {
                val = modules[val];
            }
            return val;
        },
        set: function (val) {
            valType = typeof val;
            if(valType === 'function') {
                valType = 'module';
                val = val.name;
            }
            localStorage.setItem(id, `${valType}:${val}`);
            if (setCallback) {
                setCallback(val);
            }
        }
    });
    obj[name] = obj[name]; // Trigger the setter to initialize the value
};

export default property;