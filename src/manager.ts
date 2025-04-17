import { type Message } from "discord.js";
import { pageBuilder } from "./page.ts";

export async function UIManager(
    // Interaction that generated the UI
    message: Message,

    // All possible screens from this interface
    pages: pageBuilder[]
): Promise<boolean> {
    message.edit(pages[0].render);

    return true;
}
