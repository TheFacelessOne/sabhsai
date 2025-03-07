import { describe, expect, it } from "@jest/globals";
import { getTestData } from "../test-utils.ts";
import { Client, Message, TextChannel } from "discord.js";

const testData = getTestData();
const channel = testData.channel;

const message = await channel.send(".");

describe("setup", () => {
    it("data structure", async () => {
        expect.assertions(2);

        const testData = getTestData();

        expect(testData.client).toBeInstanceOf(Client);
        expect(testData.channel).toBeInstanceOf(TextChannel);
    });
});

describe("bot client", () => {
    it("can send a message", async () => {
        expect.assertions(1);

        expect(message).toBeInstanceOf(Message);
    });

    it("can edit messages", async () => {
        expect.assertions(3);

        const updatedMessage = await message.edit("Test");

        expect(message.editable).toBe(true);
        expect(updatedMessage.content).toBe("Test");
        expect(updatedMessage.editedTimestamp).not.toBeNull();
    });
});
