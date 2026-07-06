import Phaser from 'phaser';
import property from './property';
import { modules } from './modules';

export default class PropertyArray extends Array{
    constructor(name, empty = false) {
        super();

        this.name = name;
        // this.data = [];

        if (!empty) {
            this.load();
        }
    }

    push (item) {
        if(!(item instanceof Object)) return this.length;

        const maItem = {};
        for (const key in item) {
            if(!(item[key] instanceof Object) || item[key].hasOwnProperty('name')) {
                property(maItem, key, `${this.name}.${key}.${Phaser.Utils.String.UUID()}`);
                maItem[key] = item[key];
            }
        }

        const result = super.push(maItem);
        this.save();

        return result;
    }

    splice (start, deleteCount, ...items) {
        const removed = super.splice(start, deleteCount, ...items);
        this.save();
        return removed;
    }

    save () {
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    load () {
        const storedData = localStorage.getItem(this.name);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) {
                    parsedData.forEach(item => {
                        const maItem = {};
                        if(item.properties instanceof Array){
                            item.properties.forEach(prop => {
                                property(maItem, prop.name, prop.id);
                            });
                        }
                        super.push(maItem);
                    });
                } else {
                    console.warn(`Data for ${this.name} is not an array.`);
                }
            } catch (error) {
                console.error(`Error parsing data for ${this.name}:`, error);
            }
        }
    }
}
