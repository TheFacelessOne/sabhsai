import {
    ActionRowBuilder,
    BaseMessageOptions,
    Embed,
    EmbedBuilder,
    Message,
    MessageActionRowComponentBuilder,
} from "discord.js";
import { Footnote } from "./footnote.ts";

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
    private updateFunction: PageUpdateFunction | undefined;
    footnotes: Footnote<MessageActionRowComponentBuilder>[] = [];
    pageNumber: string | number;

    constructor(pageNumber: string | number, data?: EmbedBuilder | Message) {
        if (data instanceof EmbedBuilder) this.embed = data;
        if (data instanceof Message) this.importMessage(data);
        this.pageNumber = pageNumber;
    }

    publish(): BaseMessageOptions {
        if (this.updateFunction) this.update();

        // Empty Message
        if (!this.embed && !this.title && this.footnotes.length == 0) {
            return { content: "." };
        }

        const output: BaseMessageOptions = {
            content: this.title,
        };
        if (this.embed) output.embeds = [this.embed];
        output.components = this.getActionRows();
        return output;
    }

    importMessage(msg: Message): void {
        this.embed = msg.embeds[0];
        this.title = msg.content;
    }

    addUpdateFunction(updateFunction: PageUpdateFunction) {
        this.updateFunction = updateFunction;
        return this;
    }

    update(): void {
        if (!this.updateFunction)
            throw new Error("No update function has been defined");
        this.updateFunction(this);
    }

    addFootnote(footnote: Footnote<MessageActionRowComponentBuilder>): void {
        if (this.footnotes.length == 5)
            throw new Error("Messages can only contain up to 5 Action Rows");
        this.footnotes.push(footnote);
    }

    getActionRows(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
        if (this.footnotes.length == 0) return [];
        const components: ActionRowBuilder<MessageActionRowComponentBuilder>[] =
            [];
        this.footnotes.forEach((fn) => {
            components.push(fn.row);
        });
        return components;
    }
}
