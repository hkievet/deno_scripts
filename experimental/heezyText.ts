import {
  assertEquals,
  assertArrayContains,
} from "https://deno.land/std@0.71.0/testing/asserts.ts";

export function printBranding() {
  printTwelveNumbers();
}

function centerWord(word: string, numOutputColumns: number): string {
  const areaToPad = numOutputColumns - word.length;
  if (areaToPad <= 0 || word.length > numOutputColumns) {
    return word;
  }
  if (areaToPad % 2 === 0) {
    // is even
    let padBoth = " ".repeat(Math.floor(areaToPad / 2));
    word = padBoth + word + padBoth;
  } else {
    if (areaToPad === 1) {
      return " " + word;
    }
    // ... 1.5 2.5
    const flooredHalf = Math.floor(areaToPad / 2);
    let padHead = " ".repeat(flooredHalf + 1);
    let padTail = "";
    if (flooredHalf > 0) {
      padTail = " ".repeat(flooredHalf);
    }
    word = padHead + word + padTail;
    // hang in further
  }
  return word;
}

https:
//deno.land/manual/testing
Deno.test({
  name: "repeat...",
  fn: () => {
    assertEquals(".".repeat(1), ".");
    assertEquals(".".repeat(0), "");
  },
});
Deno.test({
  name: "test center: perfect fit",
  fn: () => {
    const word = "x";
    const columns = 1;
    const expect = "x";
    assertEquals(centerWord(word, columns), expect);
  },
});
Deno.test({
  name: "test center: odd spacing",
  fn: () => {
    const word = "x";
    const columns = 2;
    const expect = " x";
    assertEquals(centerWord(word, columns), expect);
  },
});
Deno.test({
  name: "test center: even spacing",
  fn: () => {
    const word = "x";
    const columns = 3;
    const expect = " x ";
    assertEquals(centerWord(word, columns), expect);
  },
});

function centerLines(lines: string[]): string[] {
  const lengths = lines.map((l) => {
    return l.length;
  });
  const maxLength = Math.max(...lengths);
  return lines.map(
    ((line) => {
      const centeredLine = centerWord(line, maxLength);
      return centeredLine;
    }),
  );
}
// A MYSTERY FUNCTION
function printTwelveNumbers() {
  let number = 1;
  let numbers = "";
  for (; number < 12; number++) {
    numbers += number.toString() + ", ";
  }
  const intro = "Common modern art";
  const pun = `FUCK ${number}`;
  const centeredLines = centerLines([intro, numbers, pun]);
  const lines = centeredLines.join("\n");
  console.log(lines);
}
