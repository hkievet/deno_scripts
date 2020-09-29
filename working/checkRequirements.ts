function convertUint8ArrayToString(utf8array: Uint8Array): string {
  return new TextDecoder().decode(utf8array);
}

async function getOutput(command: string) {
  const process = Deno.run({
    cmd: command.split(" "),
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

interface IProgramVersionLookup {
  name: string;
  versionCommand: string;
}

const programs = [
  { name: "git", versionCommand: "git --version" },
  { name: "npm", versionCommand: "npm -v" },
  { name: "yarn", versionCommand: "yarn -v" },
];

async function validateProgramVersions() {
  programs.forEach(async (program: IProgramVersionLookup) => {
    const versionOutput = await getOutput(program.versionCommand);
    printSuccessVersion(program.name, versionOutput);
  });
}

await validateProgramVersions();
