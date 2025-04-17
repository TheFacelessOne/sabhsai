import { describe, expect, it } from "@jest/globals";
import { Page } from "../../src/page.ts";
import { Book } from "../../src/book.ts";
import { getTestData } from "../test-utils.ts";

const testData = await getTestData();
const msg = testData.message;

describe("books", () => {
    it("writes books", async () => {
        expect.hasAssertions();

        const testPage = new Page(0);
        const manuscript = new Book(testPage);
        await manuscript.open(msg);

        expect(manuscript.getBookstand()).toBe(msg);
        expect(manuscript.ref).toBeDefined();
        expect(manuscript.pages.get("__SABHSAI_RESERVED__COVER")).toBe(
            testPage
        );
        expect(manuscript.pages.get("0")).toBe(testPage);
    });

    it("checks statuses", async () => {
        expect.hasAssertions();

        const testPage = new Page(0).addUpdateFunction(() => {
            return;
        });
        testPage.title = "status_check";
        const manuscript = new Book(testPage);

        expect(manuscript.getStatus()).toBe("unpublished");

        await manuscript.open(msg);

        expect(manuscript.getStatus()).toBe("open");

        await manuscript.close();

        expect(manuscript.getStatus()).toBe("closed");

        await manuscript.open(msg);
        console.log(manuscript);
        await manuscript.close(true);

        expect(manuscript.getStatus()).toBe("deleted");
    });

    it("turns pages", async () => {
        expect.hasAssertions();

        const testPage = new Page(0);
        const manuscript = new Book(testPage);
        await manuscript.open(msg);

        expect(manuscript.currentPageNumber).toBe("__SABHSAI_RESERVED__COVER");

        manuscript.changePage(0);

        expect(manuscript.currentPageNumber).toBe("0");

        manuscript.changePage(new Page(1), true);

        expect(manuscript.currentPageNumber).toBe("1");
    });
});
