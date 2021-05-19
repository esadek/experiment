import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.10/mod.ts' 

const json = await readJSON('owid-covid-data.json')
console.log(json)

await writeJSON('data.json', json.USA.data)