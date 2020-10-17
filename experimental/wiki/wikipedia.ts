import * as wiki from "https://deno.land/x/denowiki/mod.ts";

const wikiSearchResult: wiki.WikiSearch_Query = await wiki.wikiSearch({
  language: "en",
  srsearch: "Victor Hugo",
  srlimit: 1,
});
const pageID: number = wiki.getPageId(wikiSearchResult);
console.log(wikiSearchResult);
/*
const wikiPage: wiki.WikiParse_Query = await wiki.wikiParse({
  pageid: pageID,
  language: "fr",
  prop: "wikitext|text",
});
const text: string = wiki.getWikiText(wikiPage);

console.log(text);
*/
