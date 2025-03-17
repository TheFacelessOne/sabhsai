import {
    ActionRowBuilder,
    Embed,
    EmbedBuilder,
    Message,
    MessageEditOptions,
    MessagePayload,
    StringSelectMenuBuilder,
} from "discord.js";

export const embedTemplate = new EmbedBuilder()
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
    });

type PageUpdateFunction = (page: Page) => void;

export class Page {
    title: string | undefined;
    embed: Embed | EmbedBuilder | undefined;
    updateFunction: PageUpdateFunction | undefined;
    footnotes: ActionRowBuilder<StringSelectMenuBuilder>[] | undefined[] = [];

    constructor(data?: EmbedBuilder | Message) {
        if (data instanceof EmbedBuilder) this.embed = data;
        if (data instanceof Message) this.importMessage(data);
    }

    publish(): MessageEditOptions | MessagePayload {
        if (!this.embed && !this.title) return { content: "." };

        const output: MessageEditOptions | MessagePayload = {
            content: this.title,
        };
        if (this.embed) output.embeds = [this.embed];
        return output;
    }

    importMessage(msg: Message) {
        this.embed = msg.embeds[0];
        this.title = msg.content;
    }

    update() {
        if (!this.updateFunction)
            throw new Error("No update function has been defined");
        this.updateFunction(this);
    }
}

export class pageBuilder {
    content: string | undefined;
    components: ActionRowBuilder[] = [];

    // Generates interface to be sent as a message
    render() {
        return {
            content: this.content || " ",
            components: this.components,
        };
    }

    addContent(newContent: string) {
        this.content = newContent;
        return this;
    }

    addComponents(row: ActionRowBuilder) {
        this.components.push(row);
        return this;
    }
}

// export class pageTurner {
//     constructor(UIElement: ActionRowComponent, ElementFunction: Function, output : Object) {

// 	}
// }
