import { format } from "https://deno.land/std@0.130.0/datetime/mod.ts";
import { readJSON, writeJSON, removeFile } from 'https://deno.land/x/flat@0.0.15/mod.ts';


const filename = Deno.args[0];
const data = await readJSON(filename);

const time = format(new Date(), "yyyy_mm_dd_hh_mm_ss");


const newFilename = time + filename;
await writeJSON(newFilename, data);

await removeFile(filename);