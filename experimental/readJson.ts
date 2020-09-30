export async function readJSON(fileName: string) {
  const data = Deno.readFile(fileName);
  return data;
}

const data = await readJSON("../docs/places.sqlite.json");
new TextDecoder();
