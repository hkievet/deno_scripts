async function verifyGitInstallation(): Promise<boolean> {
  const process = Deno.run({ cmd: "git -v".split(" "), stdout: "piped" });
  await process.status();
  console.log(process);
  return true;
}
