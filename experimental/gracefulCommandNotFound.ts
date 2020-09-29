async function gracefulCommandNotFound() {
  try {
    const proc = Deno.run({ cmd: ["asdf"] });
    await proc.status();
  } catch (error) {
    console.error(error);
  }
}

await gracefulCommandNotFound();
const x = "this will run";
console.log(x);
