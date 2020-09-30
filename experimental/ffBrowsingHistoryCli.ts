import { INTERVALS } from "./browserHistory/data.ts";
import { makeTimeIntervals, preprocessHistoryData, sortItemsByDate } from "./browserHistory/helpers.ts";
import { IntervalItemManager } from "./browserHistory/intervalItemManager.ts";
import { prompt } from "./browserHistory/prompt.ts";
import { IBrowsingHistoryRequest, IUserSelection } from "./browserHistory/types.ts";
import { readJSON } from "./readJson.ts";

class FFBrowsingHistoryCli {
  private data: IBrowsingHistoryRequest[] = [];
  // 2 : data set
  // 1 : good
  // 0 : bad
  public status = 1;
  constructor() {}

  public mainMenu: IUserSelection = {
    prompt: "Main Menu (m, w, d):",
    keywordActions: {
      "m": () => {
        return this.showMonthlyBreakdown();
      },
      "w": () => {
        return this.showWeeklyBreakdown();
      },
      "d": () => {
        return this.showDailyBreakdown();
      },
      "s": () => {
        return this.showFilteredBreakdown();
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

  private showBreakdown(
    intervalSize: number,
    intervalCount: number,
    items: IBrowsingHistoryRequest[],
  ): IUserSelection {
    sortItemsByDate(items);
    const intervals = makeTimeIntervals(
      new Date(Date.now()),
      new Date(intervalSize),
      intervalCount,
    );
    const iim = new IntervalItemManager(items, intervals);
    iim.print();
    return this.mainMenu;
  }

  private showWeeklyBreakdown(): IUserSelection {
    return this.showBreakdown(INTERVALS.w, 12, this.data);
  }

  private showMonthlyBreakdown(): IUserSelection {
    return this.showBreakdown(INTERVALS.m, 12, this.data);
  }

  private showDailyBreakdown(): IUserSelection {
    return this.showBreakdown(INTERVALS.d, 12, this.data);
  }
  private showFilteredBreakdown(): IUserSelection {
    const intervals = makeTimeIntervals(
      new Date(Date.now()),
      new Date(INTERVALS.w),
      12,
    );
    const iim = new IntervalItemManager(this.data, intervals);
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
cli.startEventLoop();