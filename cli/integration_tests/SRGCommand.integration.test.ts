import { Command } from "commander";
import SRGCommand from "../src/SRGAutomation/SRGCommand";

describe("SRGCommand required and mandatory options management", () => {
  it("SRGCommand fails if stage option is missing", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync(["", "", "srg", "evaluate", "--service", "any"])
    ).rejects.toThrow("error: required option '--stage <stage>' not specified");
  });

  it("SRGCommand fails if service option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync(["", "", "srg", "evaluate", "--stage", "any"])
    ).rejects.toThrow(
      "error: required option '--service <service>' not specified"
    );
  });

  it("SRGCommand fails if stage option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--service",
        "any",
        "--stage"
      ])
    ).rejects.toThrow("error: option '--stage <stage>' argument missing");
  });

  it("SRGCommand fails if service option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--stage",
        "any",
        "--service"
      ])
    ).rejects.toThrow("error: option '--service <service>' argument missing");
  });

  it("SRGCommand fails if start-time option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--stage",
        "any",
        "--service",
        "any",
        "--start-time"
      ])
    ).rejects.toThrow(
      "error: option '--start-time <starttime>' argument missing"
    );
  });
  it("SRGCommand fails if end-time option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--stage",
        "any",
        "--service",
        "any",
        "--end-time"
      ])
    ).rejects.toThrow("error: option '--end-time <endtime>' argument missing");
  });
  it("SRGCommand fails if application option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--stage",
        "any",
        "--service",
        "any",
        "--application"
      ])
    ).rejects.toThrow(
      "error: option '--application <application>' argument missing"
    );
  });
  it("SRGCommand fails if provider option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--stage",
        "any",
        "--service",
        "any",
        "--provider"
      ])
    ).rejects.toThrow("error: option '--provider <provider>' argument missing");
  });
  it("SRGCommand fails if release-version option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--stage",
        "any",
        "--service",
        "any",
        "--release-version"
      ])
    ).rejects.toThrow(
      "error: option '--release-version <releaseVersion>' argument missing"
    );
  });
  it("SRGCommand fails if buildId option is missing the argument", async () => {
    const program = new Command();
    program.name("Test program").exitOverride();
    new SRGCommand(program);

    await expect(
      program.parseAsync([
        "",
        "",
        "srg",
        "evaluate",
        "--stage",
        "any",
        "--service",
        "any",
        "--buildId"
      ])
    ).rejects.toThrow("error: option '--buildId <buildId>' argument missing");
  });
});
