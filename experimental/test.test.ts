import {
  assert,
  fail,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test({
  name: "simple test",
  fn: () => {
    assertEquals(true, true);
  },
});
