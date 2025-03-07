import {
    ActionRowBuilder,
    EmbedBuilder,
    MessageEditOptions,
    MessagePayload,
} from "discord.js";

export class Page {
    title = ".";
    embed: EmbedBuilder | undefined;

    constructor(genEmbed?: EmbedBuilder | true) {
        this.embed = genEmbed instanceof EmbedBuilder ? genEmbed : undefined;
        this.embed =
            genEmbed == true
                ? new EmbedBuilder()
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
                : undefined;
    }

    publish() {
        return this.embed != undefined
            ? ({ embeds: [this.embed] } as MessageEditOptions | MessagePayload)
            : this.title;
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
