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
            if(val){
                const semicolonIndex = val.indexOf(':');
                valType = val.substring(0, semicolonIndex);
                val = val.substring(semicolonIndex + 1);
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
                if(valType === 'object') {
                    try {
                        val = JSON.parse(val);
                    } catch (e) {
                        console.error(`Error parsing JSON for property ${name} with id ${id}:`, e);
                        val = null;
                    }
                }
            }else val = undefined;
            return val;
        },
        set: function (val) {
            valType = typeof val;
            if(valType === 'function' && val.hasOwnProperty('name')) {
                valType = 'module';
                val = val.name;
            }
            if(valType === 'object') {
                val = JSON.stringify(val);
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