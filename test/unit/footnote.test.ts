/* eslint-disable jest/max-expects */
import { describe, expect, it } from "@jest/globals";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import { Footnote } from "../../src/footnote.ts";

const buttonFtn = new Footnote(
    new ButtonBuilder()
        .setCustomId("test")
        .setLabel("test")
        .setStyle(ButtonStyle.Primary)
);

function genButton(counter: number): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId(counter.toString())
        .setLabel(counter.toString())
        .setStyle(ButtonStyle.Primary);
}

describe("footnotes", () => {
    it("basics", () => {
        expect.assertions(6);

        expect(buttonFtn).toBeInstanceOf(Footnote);
        expect(buttonFtn.components[0]).toBeInstanceOf(ButtonBuilder);
        expect(buttonFtn.components).toHaveLength(1);
        expect(buttonFtn.row).toBeInstanceOf(ActionRowBuilder<ButtonBuilder>);
        expect(buttonFtn.maximumComponents).toBe(5);
        expect(buttonFtn.type).toBe(ComponentType.Button);
    });

    it("adds buttons", () => {
        expect.assertions(2);

        let counter = 0;
        buttonFtn.add(genButton(counter++));

        expect(buttonFtn.components).toHaveLength(2);

        buttonFtn.add(genButton(counter++));

        expect(buttonFtn.components).toHaveLength(3);
    });

    it("adds SelectMenus", () => {
        expect.hasAssertions();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("test_error_string")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setDescription("test")
                    .setLabel("test")
                    .setValue("test_option")
            );

        const SelectMenuFtn = new Footnote(selectMenu);

        expect(SelectMenuFtn).toBeInstanceOf(Footnote);
        expect(SelectMenuFtn.components[0]).toBeInstanceOf(
            StringSelectMenuBuilder
        );
        expect(SelectMenuFtn.components).toHaveLength(1);
        expect(SelectMenuFtn.row).toBeInstanceOf(
            ActionRowBuilder<StringSelectMenuBuilder>
        );
        expect(SelectMenuFtn.maximumComponents).toBe(1);
        expect(SelectMenuFtn.type).toBe(ComponentType.StringSelect);
    });

    it("errors", () => {
        expect.assertions(3);

        // Tests adding two different types of components
        expect(() => {
            const errorFtn = new Footnote(
                new ButtonBuilder()
                    .setCustomId("test_error")
                    .setLabel("test_error")
                    .setStyle(ButtonStyle.Primary)
            );
            errorFtn.add(
                new StringSelectMenuBuilder()
                    .setCustomId("test_error_string")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setDescription("test")
                            .setLabel("test")
                            .setValue("test_option")
                    ) as never
            );
        }).toThrow(
            "Cannot add different Component Types to the same Footnote / Action Row"
        );

        // Tests adding too many buttons
        expect(() => {
            let counter = 0;
            const ftn = new Footnote(genButton(counter));
            while (counter < 5) {
                counter++;
                ftn.add(genButton(counter));
            }
        }).toThrow(
            "You can only have 5 components in a Button Footnote / Action Row"
        );

        // Tests adding too many SelectMenus
        expect(() => {
            const selectMenuFtn = new Footnote(
                new StringSelectMenuBuilder()
                    .setCustomId("test_error_string")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setDescription("test")
                            .setLabel("test")
                            .setValue("test_option")
                    )
            );
            selectMenuFtn.add(
                new StringSelectMenuBuilder()
                    .setCustomId("test_error_string")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setDescription("test")
                            .setLabel("test")
                            .setValue("test_option2")
                    )
            );
        }).toThrow(
            "You can only have 1 components in a SelectMenu Footnote / Action Row"
        );
    });
});
