async function initializeGit() {
  const gitInitProcess = Deno.run({
    cmd: ["git", "init"],
  });
  await gitInitProcess.status();
}

async function initializeNpm() {
  const npmInitProcess = Deno.run({
    cmd: ["npm", "init"],
  });
  await npmInitProcess.status();
}

async function initalizeEslint() {
  const eslintInit = Deno.run({
    cmd: ["npx", "eslint", "--init"],
  });

  await eslintInit.status();
}

await initializeGit();
await initializeNpm();
await initalizeEslint();
