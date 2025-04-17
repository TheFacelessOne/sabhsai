import { describe, expect, it } from "@jest/globals";
import { Page } from "../../src/page.ts";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { Footnote } from "../../src/footnote.ts";

const genPg = () => {
    return new Page(0);
};

describe("pages", () => {
    it("no update function", () => {
        expect.hasAssertions();

        const pg = genPg();

        expect(() => {
            pg.update();
        }).toThrow("No update function has been defined");
    });

    it("maxed out action rows", () => {
        expect.assertions(1);

        expect(() => {
            const pg = genPg();

            let counter = 0;
            while (counter < 6) {
                counter++;
                pg.addFootnote(
                    new Footnote(
                        new ButtonBuilder()
                            .setCustomId(counter.toString())
                            .setLabel(counter.toString())
                            .setStyle(ButtonStyle.Primary)
                    )
                );
            }
        }).toThrow("Messages can only contain up to 5 Action Rows");
    });
});
