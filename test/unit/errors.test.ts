import { describe, expect, it } from "@jest/globals";
import { Page } from "../../src/page.ts";
import { Book } from "../../src/book.ts";

describe("pages", () => {
    it("can't get an empty bookstand", () => {
        expect.assertions(1);

        expect(() => {
            return new Book(new Page(0)).getBookstand();
        }).toThrow("No bookstand has been defined");
    });

    it("doesn't duplicate pages", () => {
        expect.assertions(1);

        expect(() => {
            return new Book(new Page(0)).addPage(new Page(0));
        }).toThrow(
            "No duplicate page numbers, page numbers resolve to strings"
        );
    });
});
