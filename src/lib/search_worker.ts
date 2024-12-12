import Fuse from 'fuse.js';

const options = {
    keys: ['city_ascii'],
    threshold: 0.3
};

let fuse: Fuse<CityData>;
let first = true;

onmessage = (event) => {
    const data = event.data as string;
    if (first) {
        fuse = new Fuse(event.data, options);
        first = false;
        return;
    }
    const result = fuse.search(data, {limit:3});
    const cities = result.map((entry) => {return entry.item;});
    postMessage(cities);
}