import { describe, expect, it } from "@jest/globals";
import { EditableMessage, getTestData } from "../test-utils.ts";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { Page } from "../../src/page.ts";
import { Footnote } from "../../src/footnote.ts";

const testData = await getTestData();

describe("footnotes", () => {
    const testFootnote = new Footnote(
        new ButtonBuilder()
            .setCustomId("footnote test")
            .setDisabled(true)
            .setLabel("text")
            .setStyle(ButtonStyle.Primary)
    );

    it("buttons", async () => {
        expect.assertions(2);

        let msg = testData.message;
        const testPage = new Page(0);
        testPage.title = ".";

        testPage.addFootnote(testFootnote);

        msg = (await msg.edit(testPage.publish())) as EditableMessage;
        const msgButtonJSON = msg.components[0]?.toJSON();
        const pgButtonJSON = testPage.getActionRows()[0]?.toJSON();

        expect(pgButtonJSON).toBeDefined();
        expect(msgButtonJSON).toBeDefined();
    });
});
