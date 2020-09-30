type Bucket = "work" | "socmed" | "ambiguous";

export interface IBrowsingHistoryRequest {
  visitDate: Date;
  lastVisitDate: Date;
  url: string;
}

export interface IAnalysisDimension {
  name: string;
  bucket: Bucket;
  test: string; // the url will be matched against this
}

export interface ITimeInterval {
  startDate: Date; // greater than or equal
  endDate: Date; // less than
}

export interface IUserSelection {
  prompt: string;
  keywordActions: { [key: string]: () => IUserSelection };
}

export const defaultSelection: IUserSelection = {
  prompt: "DEADEND Placeholder menu.  You're lost boi.",
  keywordActions: {},
};

