import DQLQuery from "./DQLQuery";

describe("DQLQuery", () => {
  it("should be initialized", () => {
    const query = new DQLQuery(
      "query",
      "defaultTimeframeStart",
      "defaultTimeframeEnd",
      "timezone",
      "locale",
      1,
      2,
      3,
      true,
      4,
      5
    );
    expect(query).toBeDefined();
    expect(query.query).toEqual("query");
    expect(query.defaultTimeframeStart).toEqual("defaultTimeframeStart");
    expect(query.defaultTimeframeEnd).toEqual("defaultTimeframeEnd");
  });
});
