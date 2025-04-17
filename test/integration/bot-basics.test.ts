import { describe, expect, it } from "@jest/globals";
import { Client, Message, TextChannel } from "discord.js";
import { getTestData } from "../test-utils.ts";

const testData = await getTestData();
const message = testData.message;

describe("setup", () => {
    it("data structure", async () => {
        expect.assertions(3);

        expect(testData.client).toBeInstanceOf(Client);
        expect(testData.channel).toBeInstanceOf(TextChannel);
        expect(testData.message).toBeInstanceOf(Message);
    });
});

describe("bot client", () => {
    it("can edit messages", async () => {
        expect.assertions(3);

        const updatedMessage = await message.edit("Test");

        expect(message.editable).toBe(true);
        expect(updatedMessage.content).toBe("Test");
        expect(updatedMessage.editedTimestamp).not.toBeNull();
    });
});
