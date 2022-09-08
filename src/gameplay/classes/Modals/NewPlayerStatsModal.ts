import { MessageActionRow, TextInputComponent } from "discord.js";
import { MessageComponentTypes, TextInputStyles } from "discord.js/typings/enums.js";
import { Attribute } from "../../types/index.js";
import { zModal } from "./zModal.js";

export class NewPlayerStatsModal extends zModal {
    constructor() {
        const statsComponents = [...Object.keys(Attribute)].map(
            (attr) => new MessageActionRow({
                components: [
                    new TextInputComponent({
                        type: MessageComponentTypes.TEXT_INPUT,
                        customId: `${attr}`,
                        style: TextInputStyles.SHORT,
                        required: true,
                        label: attr,
                    }),
                ],
            }),
        );

        super({
            title: "Character Creation",
            customId: `char_creation`,
            components: statsComponents
        });
    }
}
