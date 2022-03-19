import { format } from "https://deno.land/std@0.130.0/datetime/mod.ts";
import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts';


const filename = Deno.args[0];
const newFilename = "postprocessed_" + filename;

const data = await readJSON(filename);
const postprocessedData = await readJSON(newFilename);

data.time = format(new Date(), "yyyy-MM-dd HH:mm:ss");

const newData = { postprocessedData, data };


await writeJSON(newFilename, newData);