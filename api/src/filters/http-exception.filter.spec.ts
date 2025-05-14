import { HttpExceptionFilter } from "./http-exception.filter";

describe("CatchEverythingFilter", () => {
  it("should be defined", () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });
});
