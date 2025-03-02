/* eslint-disable jest/require-top-level-describe */
import { expect, test } from "@jest/globals";
import { login } from "../test-utils";

test("succesfully exported client to a test", async () => {
    expect.hasAssertions();
    await expect(login()).resolves.toBeTruthy();
});
