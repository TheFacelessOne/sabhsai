// Starts up a discord bot for testing purposes
export { getTestData };

// Required modules
import {
    Client,
    GatewayIntentBits,
    IntentsBitField,
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

interface TestData {
    client: Client;
    channel: SendableChannels;
}

async function login(): Promise<TestData> {
    const alreadyOnline = testClient.uptime != null;
    if (alreadyOnline) throw new Error("Tried to login twice");

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

    const testData: TestData = Object.freeze({
        client: testClient,
        channel: testChannel,
    });

    return testData;
}

const td = await login();

function getTestData() {
    return td;
}
