interface IWriteFile {
  fileName: string;
  content: string;
}
const writeToFile = async (f: IWriteFile) => {
  const write = await Deno.writeTextFile(f.fileName, f.content);
  console.log("File written to", f.fileName);
};
