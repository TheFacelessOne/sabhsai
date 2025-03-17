import { describe, expect, it } from "@jest/globals";
import { getTestData } from "../test-utils.ts";
import { Embed, Message } from "discord.js";
import { embedTemplate, Page } from "../../src/pages.ts";

const testData = getTestData();
const channel = testData.channel;
const testPage = new Page();
// eslint-disable-next-line jest/require-hook
let msg = await channel.send(".");

describe("pages", () => {
    it("send basic message", async () => {
        expect.assertions(3);

        expect(msg).toBeInstanceOf(Message);
        expect(msg.content).toBe(".");

        testPage.title = "updated";
        msg = await msg.edit(testPage.title);

        expect(msg.content).toBe(testPage.title);
    });

    it("sends embeded content", async () => {
        expect.assertions(4);

        const testPages = [new Page(), new Page(embedTemplate)];

        const embedResult = [false, true];

        for (let i = 0; i < testPages.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            msg = await msg.edit(testPages[i]!.publish());

            expect(msg).toBeInstanceOf(Message);
            expect(msg.embeds[0] instanceof Embed).toBe(embedResult[i]);
        }
    });

    it("can update pages", async () => {
        expect.hasAssertions();

        let testPage = new Page(embedTemplate);
        testPage.title = ".";

        const titleChange = (page: Page) => {
            page.title = "change";
        };
        testPage.updateFunction = titleChange;
        testPage.update();

        msg = await msg.edit(testPage.publish());

        expect(msg.content).toBe("change");

        testPage = new Page(msg);
        testPage.title = "";

        msg = await msg.edit(testPage.publish());

        expect(msg.content).toBe("");
    });
});
