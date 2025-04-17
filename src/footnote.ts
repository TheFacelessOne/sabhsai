import {
    ActionRowBuilder,
    MessageActionRowComponentBuilder,
    ComponentType as CT,
} from "discord.js";

// Each Footnote is an ActionRow
export class Footnote<ComponentType extends MessageActionRowComponentBuilder> {
    row: ActionRowBuilder<ComponentType>;
    components: ComponentType[] = [];
    type?: CT;
    maximumComponents?: number;

    constructor(builder: ComponentType) {
        this.row = new ActionRowBuilder<ComponentType>().addComponents(builder);
        this.components = this.row.components;
        this.type = builder.data.type;
        this.updateMaxComponents();
    }

    add(component: ComponentType): this {
        if (this.type != component.data.type) {
            throw new Error(
                "Cannot add different Component Types to the same Footnote / Action Row"
            );
        }

        this.updateMaxComponents();
        if (this.components.length == this.maximumComponents) {
            throw new Error(
                `You can only have ${
                    this.maximumComponents
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                } components in a ${CT[this.type!]} Footnote / Action Row`
            );
        }

        this.row.addComponents(component);

        return this;
    }

    private updateMaxComponents(): void {
        this.maximumComponents = this.type == CT.Button ? 5 : 1;
    }
}
