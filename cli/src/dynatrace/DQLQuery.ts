//Fields names gather from Dynatrace API for DQL query
class DQLQuery {
  query: string;

  defaultTimeframeStart: string;
  defaultTimeframeEnd: string;
  private timezone: string;
  private locale: string;
  private maxResultRecords: number;
  private fetchTimeoutSeconds: number;
  private requestTimeoutMilliseconds: number;
  private enablePreview: boolean;
  private defaultSamplingRatio: number;
  private defaultScanLimitGbytes: number;

  constructor(
    query: string,
    defaultTimeframeStart: string,
    defaultTimeframeEnd: string,
    timezone: string,
    locale: string,
    maxResultRecords: number,
    fetchTimeoutSeconds: number,
    requestTimeoutMilliseconds: number,
    enablePreview: boolean,
    defaultSamplingRatio: number,
    defaultScanLimitGbytes: number
  ) {
    this.query = query;
    this.defaultTimeframeStart = defaultTimeframeStart;
    this.defaultTimeframeEnd = defaultTimeframeEnd;
    this.timezone = timezone;
    this.locale = locale;
    this.maxResultRecords = maxResultRecords;
    this.fetchTimeoutSeconds = fetchTimeoutSeconds;
    this.requestTimeoutMilliseconds = requestTimeoutMilliseconds;
    this.enablePreview = enablePreview;
    this.defaultSamplingRatio = defaultSamplingRatio;
    this.defaultScanLimitGbytes = defaultScanLimitGbytes;
  }
}
export default DQLQuery;
