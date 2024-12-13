import Fuse from 'fuse.js';
import Papa from 'papaparse';
import worldcities from '$lib/worldcities.csv?raw';

const options = {
  keys: ['city_ascii'],
  threshold: 0.3
};
let data: CityDataArray;

const parsed = Papa.parse(worldcities);
const headers = parsed.data[0];
data = parsed.data.slice(1).map(row => {
  // @ts-ignore
  return row.reduce((acc, value, index) => {
    // @ts-ignore
    acc[headers[index]] = value;
    return acc;
  }, {});
});
let fuse = new Fuse(data, options);

onmessage = (event) => {
  const input = event.data as string;
  const result = fuse.search(input, {limit:3});
  const cities = result.map((entry) => {return entry.item;});
  postMessage(cities);
}