import { readLines } from "https://deno.land/std@0.71.0/io/bufio.ts";

export async function prompt(q: string): Promise<string | undefined> {
  console.log("\n" + q);
  for await (const line of readLines(Deno.stdin)) {
    return line;
  }
}
