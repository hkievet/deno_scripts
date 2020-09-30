import { IAnalysisDimension } from "./types.ts";

const dimensions: {[key: string]: IAnalysisDimension} = {
twitter: {
    name: "twitter",
    bucket: "socmed",
    test: "twitter",
  },
  google:
  {
    name: "google",
    bucket: "ambiguous",
    test: "google.com",
  },
  stackOverlow: {
    name: "stackoverflow",
    bucket: "work",
    test: "stackoverflow",
  },
  jira: {
    name: "jira",
    bucket: "work",
    test: "oneome.atlassian.net",
  },
};

export const INTERVALS = {
  "m": 4 * 7 * 27 * 60 * 60 * 1000,
  "w": 7 * 27 * 60 * 60 * 1000,
  "d": 27 * 60 * 60 * 1000,
  "h": 60 * 60 * 1000,
};