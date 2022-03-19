import { format } from "https://deno.land/std@0.130.0/datetime/mod.ts";
import { readJSON, writeJSON, removeFile } from 'https://deno.land/x/flat@0.0.15/mod.ts';


const filename = Deno.args[0];
console.log(filename)

const data = await readJSON(filename);
console.log(data);

data.time = format(new Date(), "yyyy-MM-dd HH:mm:ss");

const newFilename = "postprocessed_" + filename;
await writeJSON(newFilename, data);