import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.71.0/testing/asserts.ts";

type WindowElement = any;
interface IWindow {
  height: number;
  width: number;
  elements: WindowElement[];
}

/**
 * Asserts is the window is valid
 * 
 * @remarks
 * I wanted to try the type predicates released in TS 3.7 https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
 * 
 * @param window
 * 
 * @returns True if valid, false if problematic
 */
function validateWindow(window: IWindow): window is IWindow {
  return window.height > 0 && window.width > 0 && window.elements.length >= 0;
}

/**
 * Returns the string representation of a window
 * 
 * @remarks
 * This could be logged to see what the window represents
 * 
 * @param window - window to generate string representation for
 */
function getWindowString(window: IWindow): string {
  if (validateWindow(window)) {
    const cols = Array(window.height).fill(" ");
    const rows = Array(window.width).fill(" ");
    const windowRepresentation = cols.map(() => {
      const rowString = rows.map(() => {
        return " ";
      }).join('');
      return rowString;
    }).join("\n");
    return windowRepresentation;
  } else {
    throw "invalid window";
  }
}

/**
 * Makes a simple window frame...
 * 
 * @param height 
 * @param width 
 * @param elements 
 */
function makeWindow(
  height: number,
  width: number,
  elements: WindowElement[],
): IWindow {
  const window = { height, width, elements };
  if (validateWindow(window)) {
    return window;
  } else {
    throw new Error("invalid window");
  }
}

Deno.test({
  name: "Test empty window",
  fn: () => {
    const throwFunction = () => {
      makeWindow(0, 0, []);
    };
    assertThrows(throwFunction, Error, "invalid window");
  },
});

Deno.test({
  name: "Test simple 1x1 window",
  fn: () => {
    const window = makeWindow(1, 1, []);
    const representation = getWindowString(window);
    assertEquals(representation, " ");
  },
});

Deno.test({
  name: "Test larger window",
  fn: () => {
    const window = makeWindow(2, 2, []);
    const representation = getWindowString(window);
    assertEquals(representation, "  \n  ");
  },
});

