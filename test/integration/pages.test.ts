import { describe, expect, it } from "@jest/globals";
import { getTestData } from "../test-utils.ts";
import { Embed, EmbedBuilder, Message } from "discord.js";
import { Page } from "../../src/pages.ts";

const testData = getTestData();
const channel = testData.channel;
const testPage = new Page();
// eslint-disable-next-line jest/require-hook
let msg = await channel.send(testPage.title);

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
        expect.hasAssertions();

        const testPages = [
            new Page(),
            new Page(true),
            new Page(
                new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Some title")
                    .setURL("https://discord.js.org/")
                    .setAuthor({
                        name: "Some name",
                        iconURL: "https://i.imgur.com/AfFp7pu.png",
                        url: "https://discord.js.org",
                    })
                    .setDescription("Some description here")
                    .setThumbnail("https://i.imgur.com/AfFp7pu.png")
                    .addFields(
                        {
                            name: "Regular field title",
                            value: "Some value here",
                        },
                        { name: "\u200B", value: "\u200B" },
                        {
                            name: "Inline field title",
                            value: "Some value here",
                            inline: true,
                        },
                        {
                            name: "Inline field title",
                            value: "Some value here",
                            inline: true,
                        }
                    )
                    .addFields({
                        name: "Inline field title",
                        value: "Some value here",
                        inline: true,
                    })
                    .setImage("https://i.imgur.com/AfFp7pu.png")
                    .setTimestamp()
                    .setFooter({
                        text: "Some footer text here",
                        iconURL: "https://i.imgur.com/AfFp7pu.png",
                    })
            ),
        ];

        const embedResult = [false, true, true];

        for (let i = 0; i < 3; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            msg = await msg.edit(testPages[i]!.publish());

            expect(msg).toBeInstanceOf(Message);
            expect(msg.embeds[0] instanceof Embed).toBe(embedResult[i]);
        }
    });
});
