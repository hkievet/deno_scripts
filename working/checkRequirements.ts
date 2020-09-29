function convertUint8ArrayToString(utf8array: Uint8Array): string {
  return new TextDecoder().decode(utf8array);
}

export async function getGitVerion(): Promise<string> {
  const process = Deno.run({
    cmd: "git --version".split(" "),
    stdout: "piped",
  });
  await process.status();
  const gitVersionBytes = await process.output();
  return convertUint8ArrayToString(gitVersionBytes);
}

export async function getNpmVersion(): Promise<string> {
  const process = Deno.run({
    cmd: "npm --version".split(" "),
    stdout: "piped",
  });
  await process.status();
  const gitVersionBytes = await process.output();
  return convertUint8ArrayToString(gitVersionBytes);
}

export async function getYarnVersion(): Promise<string> {
  const process = Deno.run({
    cmd: "npm --version".split(" "),
    stdout: "piped",
  });
  await process.status();
  const yarnVersionBytes = await process.output();
  return convertUint8ArrayToString(yarnVersionBytes);
}

function printSuccessVersion(programName: string, version: string) {
  const outputString = `✅ ${programName} : ${version}`;
  Deno.stdout.write((new TextEncoder()).encode(outputString));
}

const gitVersion = await getGitVerion();
printSuccessVersion("git", gitVersion);
const npmVersion = await getNpmVersion();
printSuccessVersion("npm", npmVersion);
const yarnVersion = await getYarnVersion();
printSuccessVersion("yarn", yarnVersion);
