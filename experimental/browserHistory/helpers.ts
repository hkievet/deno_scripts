import { readLines } from "https://deno.land/std/io/bufio.ts";
import { printBranding } from "../heezyText.ts";

import { IBrowsingHistoryRequest, ITimeInterval } from "./types.ts";
// select * from moz_historyvisits mhv left join moz_places mp on mp.id = mhv.place_id
// connect to the places.sql file
// '/Users/<username>/Library/Application Support/Firefox/Profiles/uatuj11z.default-release/places.sqlite'

export function formatDate(date: Date) {
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

export function preprocessHistoryData(
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

export function filterLinks(
  filter: string,
  historyItems: IBrowsingHistoryRequest[],
): IBrowsingHistoryRequest[] {
  return historyItems.filter((item: IBrowsingHistoryRequest) => {
    return item.url.indexOf(filter) !== -1;
  });
}

export function sortItemsByDate(items: IBrowsingHistoryRequest[]) {
  items.sort((a: IBrowsingHistoryRequest, b: IBrowsingHistoryRequest) => {
    if (a.visitDate < b.visitDate) {
      return 1;
    } else {
      return -1;
    }
  });
}

// make time intervals by days in past (non calendrical)
// makeTimeIntervals(now(), 24*60*60*1000)


export function makeTimeIntervals(
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
export function breakdownItems(
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

export function printItemsByDate(
  intervals: ITimeInterval[],
  items: IBrowsingHistoryRequest[][],
) {
}

export function printLine(s: string) {
  console.log(s);
}

// could also zip up intervals and breakdown into a data object.  These are TwinArrays.  Two sides of a Zipper
// good old intervals and breakdown <3

export function stripEmptyIntervals(
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


