// Starts up a discord bot for testing purposes
import {
    Client,
    GatewayIntentBits,
    IntentsBitField,
    Message,
    OmitPartialGroupDMChannel,
    SendableChannels,
    Snowflake,
} from "discord.js";
import "dotenv/config";

// What permissions the bot needs
// Used for what events the bot can listen for too
const myIntents = new IntentsBitField().add(
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds
);

// The client we intend to login on
const testClient = new Client({ intents: myIntents });

const token = process.env.DEV_TOKEN;
if (!token) throw new Error("No DEV_TOKEN provided");

export type EditableMessage = OmitPartialGroupDMChannel<Message<boolean>> & {
    editable: true;
};

export interface TestData {
    client: Client;
    channel: SendableChannels;
    message: EditableMessage;
    time: number;
}

export async function getTestData(): Promise<TestData> {
    await testClient.login(token).catch((error) => {
        throw new Error(error);
    });

    const testChannel = await testClient.channels.fetch(
        process.env.TEST_CHANNEL as Snowflake
    );

    if (testChannel == null) throw new Error("Test Channel is null ");

    if (!testChannel.isSendable()) {
        throw new Error(
            "Permissions issue, can't send messages in test channel"
        );
    }

    const testMessage = await testChannel.messages.fetch(
        process.env.TEST_MESSAGE as Snowflake
    );

    if (!testMessage.editable)
        throw new Error("Permissions issues, Message is not editable");

    const testData: TestData = Object.freeze({
        client: testClient,
        channel: testChannel,
        message: testMessage as EditableMessage,
        time: Date.now(),
    });

    return testData;
}
