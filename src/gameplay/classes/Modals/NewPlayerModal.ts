import { MessageActionRow, TextInputComponent } from "discord.js";
import { MessageComponentTypes, TextInputStyles } from "discord.js/typings/enums.js";
import { zModal } from "./zModal.js";

export class NewPlayerModal extends zModal {
    constructor() {
        const nameComponent = new TextInputComponent({
            type: MessageComponentTypes.TEXT_INPUT,
            customId: `name`,
            style: TextInputStyles.SHORT,
            required: true,
            label: "Name",
        });

        const descriptionComponent = new TextInputComponent({
            type: MessageComponentTypes.TEXT_INPUT,
            customId: `description`,
            style: TextInputStyles.PARAGRAPH,
            required: true,
            label: "Description",
        });

        super({
            title: "Character Creation",
            customId: `char_creation`,
            components: [
                new MessageActionRow({
                    components: [nameComponent],
                }),
                new MessageActionRow({
                    components: [descriptionComponent],
                }),
            ],
        });
    }
}
