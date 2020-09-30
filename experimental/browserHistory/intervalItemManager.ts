import { readJSON } from "../readJson.ts";
import { breakdownItems, filterLinks, formatDate, makeTimeIntervals, preprocessHistoryData, printLine, sortItemsByDate, stripEmptyIntervals } from "./helpers.ts";
/**
 * INTERVAL MANAGER
 */
import { IAnalysisDimension, IBrowsingHistoryRequest, ITimeInterval } from "./types.ts";

export class IntervalItemManager {
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
  public makeChartLine(intervalIndex: number, label: string) {
    if (
      intervalIndex > this.intervalEventBreakdown.length - 1 ||
      intervalIndex < 0
    ) {
      throw "index out of bounds";
    }
    const eventsForInterval = this.intervalEventBreakdown[intervalIndex];
    // print piece of information requested add pprint
    return ` -------- ${eventsForInterval.length} ${label}`;
  }

  public print(): void {
    this.intervals.forEach((interval, i) => {
      const dateRepresentation = `${formatDate(interval.startDate)} to ${
        formatDate(interval.endDate)
      }`;
      const intervalDataDisplay = this.makeChartLine(i, "requests");
      const headerLine = `${dateRepresentation} ${intervalDataDisplay}`;
      printLine(headerLine);
    });
    return;
  }

  public printDimensions(dimension: IAnalysisDimension): void {
    this.intervals.forEach((interval, i) => {
      const dateRepresentation = `${formatDate(interval.startDate)} to ${
        formatDate(interval.endDate)
      }`;
      const subsetItems = breakdownByDimension(
        dimension,
        this.intervalEventBreakdown[i],
      );
      const subsetItemManager = new IntervalItemManager(
        subsetItems,
        [interval],
      );
      const intervalDataDisplay = subsetItemManager.makeChartLine(
        0,
        `requests for containing ${dimension.name}`,
      );
      const headerLine = `${dateRepresentation} ${intervalDataDisplay}`;
      printLine(headerLine);
    });
    return;
  }
}

function breakdownByDimension(
  dimension: IAnalysisDimension,
  historyEvents: IBrowsingHistoryRequest[],
): IBrowsingHistoryRequest[] {
  return filterLinks(dimension.test, historyEvents);
}

