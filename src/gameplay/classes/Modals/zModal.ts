import { ButtonInteraction, Modal, ModalOptions, User } from "discord.js";

export class zModal extends Modal {
    fields: Record<string, string>;
    constructor(data: Modal | ModalOptions | undefined) {
        super(data);
        this.fields = {};
    }
    async response(i: ButtonInteraction, userId: User['id']) {
        await i.showModal(this);
        const res = await i.awaitModalSubmit({
            time: 60000,
            filter: (i) => i.user.id === userId,
        });

        res.components.forEach(component => component.components.forEach(input => this.fields[input.customId] = input.value));

        return res;
    }
}
