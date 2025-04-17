import { describe, expect, it } from "@jest/globals";
import { EditableMessage, getTestData } from "../test-utils.ts";
import { Embed, Message } from "discord.js";
import { embedTemplate, Page } from "../../src/page.ts";

const testData = await getTestData();

describe("pages", () => {
    it("embeded content", async () => {
        expect.assertions(2);

        const msg = testData.message;
        const msgNoEmbed = await msg.edit(new Page(0).publish());
        const msgEmbed = await msg.edit(new Page(0, embedTemplate).publish());

        expect(msgEmbed.embeds[0]).toBeDefined();
        expect(msgNoEmbed.embeds[0]).toBeUndefined();
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("updating pages", async () => {
        expect.assertions(2);

        let msg = testData.message;
        let testPage = new Page(0, embedTemplate);
        testPage.title = ".";

        const titleChange = (page: Page) => {
            page.title = "change";
            return;
        };
        testPage.addUpdateFunction(titleChange);

        msg = (await msg.edit(testPage.publish())) as EditableMessage;

        testPage.update();

        msg = (await msg.edit(testPage.publish())) as EditableMessage;

        expect(msg.content).toBe("change");

        testPage = new Page(0, msg);
        testPage.title = "";

        msg = (await msg.edit(testPage.publish())) as EditableMessage;

        expect(msg.content).toBe("");
    });
});
