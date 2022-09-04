import {
  ButtonInteraction,
  ColorResolvable,
  DMChannel,
  EmbedFieldData,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbedOptions,
  MessageOptions,
  MessagePayload,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
  User,
  VoiceChannel,
} from "discord.js";
import ExtendedMessage from "../../classes/ExtendedMessage.js";
import { sleep } from "../../utility/other.js";
import { waitUntilEvent } from "../helpers.js";
import {
  Attribute,
  EncounterData,
  EncounterOptionResult,
  EncounterResult,
  PlayerData,
} from "../types/index.js";

type DiscordChannel =
  | TextChannel
  | DMChannel
  | PartialDMChannel
  | NewsChannel
  | ThreadChannel
  | VoiceChannel;

// Handles messaging the user and returning their responses
export class UserInterface {
  channel: DiscordChannel;
  user: User;
  constructor(msg: ExtendedMessage) {
    this.channel = msg.message.channel;
    this.user = msg.message.author;
  }

  /*
  Gets the information required to start a new character
  */
  async newPlayer(): Promise<PlayerData> {
    const player = {
      name: "bonk",
      description:
        "A wily elf with a bone to pick with those self righteous goblins",
      health: 23,
      score: 0,
      stats: {
        [Attribute.STRENGTH]: 5,
        [Attribute.WISDOM]: 2,
        [Attribute.AGILITY]: 1,
        [Attribute.TALENT]: 1,
        [Attribute.CHARISMA]: -2,
      },
    };
    return player;
  }

  /*
  Sent at the start of an encounter. Message contains the flavour text
  and buttons corresponding to the various options available
  */
  async startEncounter(
    encounter: EncounterData,
  ) {
    // Sends the message containing the info
    const message = await this.channel.send(
      this.encounterToMessageOptions(encounter),
    );

    return await this.response(message);
  }

  /*
  Sends the encounter result's ending flavour text
  and buttons prompting to continue or exit
  */
  async endEncounter(
    result: EncounterOptionResult,
    playerData: PlayerData,
    interaction: ButtonInteraction,
  ) {
    // const message = await this.channel.send();
    await interaction.update({
      components: [],
      embeds: [
        ...interaction.message.embeds,
        {
          title: result.title,
          description: result.text,
          color: result.type === EncounterResult.SUCCESS
            ? [20, 240, 60]
            : [240, 40, 20],
          fields: [
            {
              name: result.effect,
              value: (result.value > 0 ? "+" : "") + result.value.toString(),
              inline: true,
            },
          ],
        },
        this.playerToEmbedOptions(playerData, {
          showDesc: false,
          showStats: false,
        }),
      ],
    });
    const msg = await this.channel.send({
      components: [UserInterface.continueMessageActionRow],
    });
    const inter = await this.response(msg);
    (inter.message as Message).delete();
    return inter;
  }

  sendPlayerInfo(player: PlayerData) {
    this.channel.send({
      embeds: [this.playerToEmbedOptions(player)],
    });
  }
  /*
  Converts data about the encounter into message options,
  including a button for each of the encounters response options
  */
  private encounterToMessageOptions(
    encounter: EncounterData,
  ): MessageOptions {
    let rowComponents = [];
    for (const label in encounter.options) {
      rowComponents.push(
        new MessageButton({
          "type": 2,
          "style": 1,
          "label": label,
          "custom_id": label,
        }),
      );
    }
    const actionRow = new MessageActionRow({
      components: rowComponents,
    });
    return {
      components: [actionRow],
      embeds: [
        {
          title: encounter.title,
          description: encounter.text,
          color: encounter.color || "FUCHSIA",
        },
      ],
    };
  }

  // Creates an embed object from the player options
  private playerToEmbedOptions(
    player: PlayerData,
    options?: { showStats?: boolean; showDesc?: boolean; showTitle?: boolean },
  ): MessageEmbedOptions {
    options = {
      showStats: true,
      showDesc: true,
      showTitle: true,
      ...options,
    };
    let fields;
    if (options.showStats) {
      fields = [];
      fields.push({
        name: "Health",
        value: player.health.toString(),
        inline: true,
      });
      for (const attr in player.stats) {
        fields.push({
          name: attr[0].toUpperCase() + attr.slice(1),
          value: player.stats[attr as Attribute].toString(),
          inline: true,
        });
      }
    }
    return {
      title: options.showTitle
        ? `${player.name} is on a ${player.score} encounter streak!`
        : undefined,
      description: options.showDesc ? player.description : undefined,
      color: [
        Math.max(255 - (player.health / 25 * 255), 0),
        Math.min((player.health / 25) * 255, 255),
        0,
      ],
      fields,
    };
  }

  /* Statically define the buttons to prompt continue or exit */
  private static continueMessageActionRow = new MessageActionRow({
    components: [
      new MessageButton({
        "type": 2,
        "style": 1,
        "label": "Continue your journey",
        "custom_id": "continue",
      }),
      new MessageButton({
        "type": 2,
        "style": 1,
        "label": "Take a break",
        "custom_id": "break",
      }),
    ],
  });

  /*
  Defines a collector to listen and WAIT for a single
  button interaction from the current player
  and return the custom button id
  */
  private async response(message: Message) {
    const collector = message.createMessageComponentCollector({
      componentType: "BUTTON",
      maxUsers: 1,
      maxComponents: 1,
      max: 1,
      filter: (i) => i.user.tag === this.user.tag,
    });
    // Uses a helper function to await the collect event on the collector and return the event
    const res: ButtonInteraction = await waitUntilEvent(collector, "collect");
    return res;
  }
}
