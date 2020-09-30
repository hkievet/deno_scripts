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

function logString(string: string) {
  Deno.stdout.write((new TextEncoder()).encode(string));
}

function printSuccessVersion(programName: string, version: string) {
  // todo handle when version input is multiple lines
  if (version.split("\n").length > 2) {
    const lines = version.split("\n");
    version = lines.map((l, i) => {
      if (i !== 0) {
        return `\t${l}`;
      }
      return l;
    }).slice(0, -1).join("\n");
  }
  const outputString = `✅ ${programName} : ${version}`;
  logString(outputString);
}

interface IProgramVersionLookup {
  name: string;
  versionCommand: string;
}

const programs = [
  { name: "brew", versionCommand: "brew -v" },
  { name: "git", versionCommand: "git --version" },
  { name: "npm", versionCommand: "npm -v" },
  { name: "yarn", versionCommand: "yarn -v" },
];

export async function validateProgramVersions() {
  programs.forEach(async (program: IProgramVersionLookup) => {
    const versionOutput = await getOutput(program.versionCommand);
    printSuccessVersion(program.name, versionOutput);
  });
}

await validateProgramVersions();
