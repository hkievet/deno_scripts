import { readLines } from "https://deno.land/std/io/bufio.ts";
import { printBranding } from "./heezyText.ts";
async function prompt(q: string): Promise<string | undefined> {
  console.log("\n" + q);
  for await (const line of readLines(Deno.stdin)) {
    return line;
  }
}

import { readJSON } from "./readJson.ts";
// select * from moz_historyvisits mhv left join moz_places mp on mp.id = mhv.place_id
// connect to the places.sql file
// '/Users/<username>/Library/Application Support/Firefox/Profiles/uatuj11z.default-release/places.sqlite'

interface IBrowsingHistoryRequest {
  visitDate: Date;
  lastVisitDate: Date;
  url: string;
}

function formatDate(date: Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }

  //return [year, month, day].join("-");
  return [month, day].join("-");
}

function preprocessHistoryData(
  historyJSONString: string,
): IBrowsingHistoryRequest[] {
  const history = JSON.parse(historyJSONString);
  // gotta divide by 1000 or it's just broken
  const historyItems = history.map((item: any) => {
    return {
      visitDate: new Date(item.visit_date / 1000),
      lastVisitDate: new Date(item.last_visit_date / 1000),
      url: item.url,
    };
  });
  return historyItems;
}

function filterLinks(
  filter: string,
  historyItems: IBrowsingHistoryRequest[],
): IBrowsingHistoryRequest[] {
  return historyItems.filter((item: IBrowsingHistoryRequest) => {
    return item.url.indexOf(filter) !== -1;
  });
}

function sortItemsByDate(items: IBrowsingHistoryRequest[]) {
  items.sort((a: IBrowsingHistoryRequest, b: IBrowsingHistoryRequest) => {
    if (a.visitDate < b.visitDate) {
      return 1;
    } else {
      return -1;
    }
  });
}

type Bucket = "work" | "socmed" | "ambiguous";
interface IAnalysisDimension {
  name: string;
  bucket: Bucket;
  test: string; // the url will be matched against this
}

const dimensions: IAnalysisDimension[] = [
  {
    name: "twitter",
    bucket: "socmed",
    test: "twitter",
  },
  {
    name: "google",
    bucket: "ambiguous",
    test: "google.com",
  },
  {
    name: "stackoverflow",
    bucket: "work",
    test: "stackoverflow",
  },
  {
    name: "jira",
    bucket: "work",
    test: "oneome.atlassian.net",
  },
];
// make time intervals by days in past (non calendrical)
// makeTimeIntervals(now(), 24*60*60*1000)

interface ITimeInterval {
  startDate: Date; // greater than or equal
  endDate: Date; // less than
}

function makeTimeIntervals(
  startTime: Date,
  intervalSpacing: Date,
  numberOfIntervals: number,
): ITimeInterval[] {
  const intervals: ITimeInterval[] = [];
  let currentIndex = startTime;
  for (let i = 0; i < numberOfIntervals; i++) {
    let nextIndex = new Date(
      currentIndex.valueOf() - intervalSpacing.valueOf(),
    );
    intervals.push({
      startDate: nextIndex,
      endDate: currentIndex,
    });
    currentIndex = nextIndex;
  }
  return intervals;
}

// obviously very crude
function breakdownItems(
  intervals: ITimeInterval[],
  items: IBrowsingHistoryRequest[],
): IBrowsingHistoryRequest[][] {
  // put each item in a bucket
  const itemBuckets: IBrowsingHistoryRequest[][] = intervals.map((i) => []);
  items.forEach((item) => {
    const index = intervals.findIndex((interval) => {
      return (interval.startDate.valueOf() <= item.visitDate.valueOf()) &&
        (item.visitDate.valueOf() < interval.endDate.valueOf());
    });
    if (index !== -1) {
      itemBuckets[index].push(item);
    }
  });
  return itemBuckets;
}

function printItemsByDate(
  intervals: ITimeInterval[],
  items: IBrowsingHistoryRequest[][],
) {
}

function printLine(s: string) {
  console.log(s);
}

// could also zip up intervals and breakdown into a data object.  These are TwinArrays.  Two sides of a Zipper
// good old intervals and breakdown <3

function stripEmptyIntervals(
  allIntervals: ITimeInterval[],
  eventBreakdown: IBrowsingHistoryRequest[][],
) {
  if (!allIntervals.length || !eventBreakdown.length) {
    return [];
  }
  const eventCount = eventBreakdown.map((events) => {
    return events.length;
  });
  // count the amount of 0 event days there are from the tail end
  let index = eventCount.length - 1;
  let count = 0;
  while (index >= 0) {
    if (eventCount[index] === 0) {
      count++;
      index--;
      continue;
    }
    break;
  }
  if (count === 0) {
    return allIntervals;
  } else {
    const indexToSlice = allIntervals.length - count;
    return [...allIntervals].slice(0, indexToSlice);
  }
}

class IntervalItemManager {
  private allRequests: IBrowsingHistoryRequest[] = [];
  private intervals: ITimeInterval[] = [];
  private intervalEventBreakdown: IBrowsingHistoryRequest[][] = [];
  public constructor(
    allRequests: IBrowsingHistoryRequest[],
    intervals: ITimeInterval[],
  ) {
    this.intervalEventBreakdown = breakdownItems(intervals, allRequests);
    this.allRequests = allRequests;
    const newIntervals = stripEmptyIntervals(
      intervals,
      this.intervalEventBreakdown,
    );
    this.intervals = newIntervals;
  }

  // analyzes allItems based on interval
  private makeChartLine(intervalIndex: number) {
    if (
      intervalIndex > this.intervalEventBreakdown.length - 1 ||
      intervalIndex < 0
    ) {
      throw "index out of bounds";
    }
    const eventsForInterval = this.intervalEventBreakdown[intervalIndex];
    // print piece of information requested add pprint
    return ` -------- ${eventsForInterval.length}`;
  }

  public print(): void {
    this.intervals.forEach((interval, i) => {
      const dateRepresentation = `${formatDate(interval.startDate)} to ${
        formatDate(interval.endDate)
      }`;
      const intervalDataDisplay = this.makeChartLine(i);
      const headerLine = `${dateRepresentation} ${intervalDataDisplay}`;
      printLine(headerLine);
    });
    return;
  }
}

function breakdownByDimension(
  dimensions: IAnalysisDimension[],
  historyEvents: IBrowsingHistoryRequest[],
) {
  return dimensions.map((d) => {
    return {
      name: d.name,
      bucket: d.bucket,
      items: filterLinks(d.test, historyEvents),
    };
  });
}

const INTERVALS = {
  "m": 4 * 7 * 27 * 60 * 60 * 1000,
  "w": 7 * 27 * 60 * 60 * 1000,
  "d": 27 * 60 * 60 * 1000,
  "h": 60 * 60 * 1000,
};

async function scratchpad() {
  const historyData = await readJSON("../docs/places.sqlite.json");
  const historyString = new TextDecoder().decode(historyData);
  const items = preprocessHistoryData(historyString);
  sortItemsByDate(items);
  const intervals = makeTimeIntervals(
    new Date(Date.now()),
    new Date(INTERVALS.d),
    30,
  );

  const itemsAnalyzedByDimension = dimensions.map((d) => {
    return {
      name: d.name,
      bucket: d.bucket,
      items: filterLinks(d.test, items),
    };
  });

  const iim = new IntervalItemManager(items, intervals);
  iim.print();
}

interface IUserSelection {
  prompt: string;
  keywordActions: { [key: string]: () => IUserSelection };
}

const defaultSelection: IUserSelection = {
  prompt: "DEADEND Placeholder menu.  You're lost boi.",
  keywordActions: {},
};

class FFBrowsingHistoryCli {
  private data: IBrowsingHistoryRequest[] = [];
  // 2 : data set
  // 1 : good
  // 0 : bad
  public status = 1;
  constructor() {}

  public mainMenu: IUserSelection = {
    prompt: "Welcome to Program, press enter to see a year breakdown",
    keywordActions: {
      "*": () => {
        return this.showMonthlyBreakdown();
      },
    },
  };

  public reset() {
    this.data = [];
    this.status = 1;
  }

  public async loadData(fileName: string) {
    const historyData = await readJSON("../docs/places.sqlite.json");
    const historyString = new TextDecoder().decode(historyData);
    const items = preprocessHistoryData(historyString);
    this.data = items;
    return this.mainMenu;
  }

  private showMonthlyBreakdown(): IUserSelection {
    const items = this.data;
    sortItemsByDate(items);
    const intervals = makeTimeIntervals(
      new Date(Date.now()),
      new Date(INTERVALS.m),
      12,
    );

    const itemsAnalyzedByDimension = dimensions.map((d) => {
      return {
        name: d.name,
        bucket: d.bucket,
        items: filterLinks(d.test, items),
      };
    });

    const iim = new IntervalItemManager(items, intervals);
    iim.print();
    return this.mainMenu;
  }

  public async handleUserSelection(menu: IUserSelection) {
    let nextUserSelection = null;
    while (!nextUserSelection) {
      const input = await prompt(menu.prompt);
      if (input) {
        if (menu.keywordActions[input]) {
          nextUserSelection = menu.keywordActions[input]();
        }
      } else {
        if (menu.keywordActions["*"]) {
          nextUserSelection = menu.keywordActions["*"]();
        }
      }
    }
    await this.handleUserSelection(nextUserSelection);
  }

  public async startEventLoop() {
    while (true) {
      await this.handleUserSelection(this.mainMenu);
    }
  }
}

const ENV_FILE_PATH = "../docs/places.sqlite.json";
let cli = new FFBrowsingHistoryCli();
await cli.loadData(ENV_FILE_PATH);
printBranding();
cli.startEventLoop();
