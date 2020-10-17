import { assertEquals } from "https://deno.land/std@0.71.0/testing/asserts.ts";
/**
 * See if there are more words in
 */
import {
  getPageId,
  wikiSearch,
} from "https://deno.land/x/denowiki@v0.1.0/lib/wikiSearch.ts";
import {
  getPageTitle,
  getWikiText,
  wikiParse,
} from "https://deno.land/x/denowiki@v0.1.0/lib/wikiParse.ts";
import { WikiParse_Query } from "https://deno.land/x/denowiki@v0.1.0/lib/interface.ts";
type Language = "en" | "fr";

interface IInputObject {
  searchTitle: string;
  mainLanguage: Language;
  secondLanguage: Language;
}

interface IOutputObject {
  primaryArticle: WikiParse_Query;
  secondaryArticle: WikiParse_Query;
}

const getWikipediaPageForTwoLanguages = async (
  input: IInputObject
): Promise<IOutputObject> => {
  const pageSearchPrimary = await wikiSearch({
    srsearch: input.searchTitle,
    language: input.mainLanguage,
    sr: 5,
  });
  const pageIdPrimary = getPageId(pageSearchPrimary);

  const pageSearchSecondary = await wikiSearch({
    srsearch: input.searchTitle,
    language: input.secondLanguage,
    sr: 5,
  });
  const pageIdSecondary = getPageId(pageSearchSecondary);

  const primaryLanguagePage: WikiParse_Query = await wikiParse({
    pageid: pageIdPrimary,
    language: input.mainLanguage,
    prop: "wikitext|text",
  });
  const secondaryLanguagePage: WikiParse_Query = await wikiParse({
    pageid: pageIdSecondary,
    language: input.secondLanguage,
    prop: "wikitext|text",
  });
  return {
    primaryArticle: primaryLanguagePage,
    secondaryArticle: secondaryLanguagePage,
  };
};

interface ILanguageComparisonOutput {
  languageWithMoreContent: Language;
}

const moreFrenchOrEnglishInWikiArticle = async (
  wikiArticleInEnglish: string
): Promise<Language> => {
  const pages = await getWikipediaPageForTwoLanguages({
    mainLanguage: "en",
    secondLanguage: "fr",
    searchTitle: wikiArticleInEnglish,
  });
  const enPages = pages.primaryArticle;
  const frPages = pages.secondaryArticle;

  const pageHeaderDebug = `En: ${getPageTitle(enPages)} Fr: ${getPageTitle(
    frPages
  )}`;
  console.log(pageHeaderDebug);

  const en = getWikiText(enPages);
  const fr = getWikiText(frPages);
  console.log(`En: ${en.length} Fr: ${fr.length}`);
  if (en.length > fr.length) {
    return "en";
  }
  return "fr";
};

Deno.test({
  name: "The french article for france should be longer",
  fn: async () => {
    const test = await moreFrenchOrEnglishInWikiArticle("Victor Hugo");
    assertEquals(test, "fr");
  },
});

Deno.test({
  name: "The English article for United States should be longer",
  fn: async () => {
    const test = await moreFrenchOrEnglishInWikiArticle("United States");
    assertEquals(test, "en");
  },
});

const args = Deno.args;
if (args.length > 0) {
  const search = args.join(" ");
  console.log(`Comparing French and English Wikipedia Content for ${search}`);
  const test = await moreFrenchOrEnglishInWikiArticle(search);
} else {
  console.log(
    "Program usage `deno run --allow-net compareLanguageContent.ts <wikipage>`"
  );
}
