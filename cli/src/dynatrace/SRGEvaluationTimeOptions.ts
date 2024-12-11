export type SRGEvaluationTimeOptions =
  | { startTime: string; endTime: string; timespan?: never }
  | { startTime?: never; endTime?: never; timespan: string };
