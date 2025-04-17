import { InteractionResponse, Message, RepliableInteraction } from "discord.js";
import { Page } from "./page.ts";

// Reserved page numbers
const SABHSAI = {
    cover: "__SABHSAI_RESERVED__COVER",
    final: "__SABHSAI_RESERVED__FINAL",
};

export class Book<stand extends Message<boolean> | RepliableInteraction> {
    pages = new Map<string | number, Page>();
    bookStand?: stand;
    ref?: Message<boolean> | InteractionResponse;
    currentPageNumber = SABHSAI.cover;
    private isOpen = false;

    private defaultExit = new Page(SABHSAI.final).addUpdateFunction(() => {
        if (this.ref) this.ref.delete();
    });

    constructor(cover: Page) {
        this.addPage(cover, SABHSAI.cover);
        this.addPageArray([cover, this.defaultExit]);
        return this;
    }

    getBookstand() {
        if (this.bookStand) return this.bookStand;
        throw new Error("No bookstand has been defined");
    }

    addPage(pg: Page, pgNumber?: string | number) {
        pgNumber = pgNumber ? pgNumber : pg.pageNumber;
        pgNumber = pgNumber.toString();
        if (this.pages.get(pgNumber))
            throw new Error(
                "No duplicate page numbers, page numbers resolve to strings"
            );
        this.pages.set(pgNumber, pg);
        return this;
    }

    addPageArray(pgs: Page[]) {
        let newPg: Page | undefined;
        while (true) {
            newPg = pgs.pop();
            if (!newPg) return this;
            this.addPage(newPg);
        }
    }

    async open(event: stand) {
        this.bookStand = event;
        this.isOpen = true;
        if (event instanceof Message) {
            this.ref = await event.reply(this.getCoverPage());
            this.messageResponseEventLoop();
        }
    }

    close(remove = false) {
        this.isOpen = false;
        if (remove && this.ref) return this.ref.delete();
        this.changePage(SABHSAI.final);
    }

    async changePage(newPg: Page | string | number, addToBook?: boolean) {
        const isPg = newPg instanceof Page;
        const hasPg = isPg ? true : this.pages.has(newPg.toString());
        if (!hasPg) throw new Error("No such page called: " + newPg.toString());

        newPg = isPg
            ? (newPg as Page)
            : (this.pages.get(newPg.toString()) as Page);

        if (addToBook) this.addPage(newPg, newPg.pageNumber);
        this.ref = await this.ref?.edit(newPg.publish());
        this.currentPageNumber = newPg.pageNumber.toString();
        return;
    }

    private async messageResponseEventLoop() {
        let componentInteraction;
        while (await this.canGenerateInteraction()) {
            componentInteraction = await this.ref
                ?.awaitMessageComponent({
                    filter: (i) => i.user.id == this.ref?.interaction?.user.id,
                    time: 60_000,
                })
                .catch((err) => {
                    console.log(err);
                });

            if (typeof componentInteraction == "undefined")
                this.changePage(SABHSAI.final);
        }
    }

    private getCoverPage() {
        const coverPg = this.pages.get(SABHSAI.cover)?.publish();
        if (!coverPg)
            throw new Error("No cover page provided, cannot read book");

        return coverPg;
    }

    private async canGenerateInteraction() {
        if (!this.isOpen) return false;
        if (!this.ref) return false;

        // No Components means no reason to keep the book open
        if ((await this.ref.fetch(true)).components.length == 0) {
            this.close();
            return false;
        }
        return true;
    }

    getStatus(): "unpublished" | "open" | "closed" | "deleted" {
        if (!this.bookStand) return "unpublished";
        if (this.isOpen) return "open";
        if (!this.ref) return "deleted";
        return "closed";
    }
}
