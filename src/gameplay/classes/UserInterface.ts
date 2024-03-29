import {
  ButtonInteraction,
  DMChannel,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageEmbedOptions,
  MessageOptions,
  ModalSubmitInteraction,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
  User,
  VoiceChannel,
} from "discord.js";
import ExtendedMessage from "../../classes/ExtendedMessage.js";
import { getChannelMessager, waitUntilEvent } from "../helpers.js";
import {
  Attribute,
  EncounterData,
  EncounterOptionResult,
  EncounterResult,
  LingeringEffect,
  LingeringEffectKey,
  PlayerData,
  PlayerStats,
} from "@ziplodocus/zumbor-types";
import { NewPlayerModal } from "./Modals/NewPlayerModal.js";
import { NewPlayerStatsModal } from "./Modals/NewPlayerStatsModal.js";

type DiscordChannel =
  | TextChannel
  | DMChannel
  | PartialDMChannel
  | NewsChannel
  | ThreadChannel
  | VoiceChannel;

// Handles messaging the user and returning their responses
export class UserInterface {
  niceMessage: ReturnType<typeof getChannelMessager>;
  channel: DiscordChannel;
  user: User;
  queuedEmbeds: (MessageEmbed | MessageEmbedOptions)[];
  constructor(msg: ExtendedMessage) {
    this.channel = msg.message.channel;
    this.user = msg.message.author;
    this.niceMessage = getChannelMessager(this.channel);
    this.queuedEmbeds = [];
  }

  queueMessage(title: string, description?: string) {
    this.queuedEmbeds.push({ title, description });
  }
  retrieveQueuedEmbeds() {
    const embeds = [...this.queuedEmbeds];
    console.log(embeds);
    this.queuedEmbeds = [];
    console.log(embeds);
    return embeds;
  }

  /*
  Gets the information required to start a new character
  */
  async newPlayer(): Promise<PlayerData | Error> {
    // Send a message containing a button to begin character creation
    const message = await this.channel.send({
      embeds: [{
        title: "Character Creator",
        description: "Click button to begin.",
      }],
      components: [
        new MessageActionRow({
          components: [
            new MessageButton({
              type: 2,
              customId: "character_create",
              style: 1,
              label: "Create",
            }),
          ],
        }),
      ],
    });

    // wait for the button interaction and display the modal
    let i = await this.response(message);

    const modal = new NewPlayerModal();
    const modalRes = await modal.response(i, this.user.id);

    // Destructure modal response into name and description
    const charDetails = modal.fields as unknown as { name: string, description: string; };

    // Send a follow up to get player stats
    // @ts-ignore
    const statsMessage: Message = await modalRes.reply(this.statsRequestMsg(charDetails.name, charDetails.description));
    i = await this.response(statsMessage);

    let statRes: ModalSubmitInteraction | undefined | Error;
    // Keep requesting until stats are valid
    const getNewPlayerStats: () => Promise<PlayerStats | Error> = async () => {
      const statModal = new NewPlayerStatsModal();
      statRes = await statModal.response(i, this.user.id);
      if (statRes instanceof Error) return statRes;
      const maybeCharStats = statModal.fields;
      let charStats: Record<string, number> = {};

      let total = 0;

      for (const stat in maybeCharStats) {
        let val = maybeCharStats[stat];
        const statnum = parseInt(val);
        total += statnum;
        if (statnum < -5 || statnum > 5) {
          console.error('Range error');
          // @ts-ignore
          const msg: Message = await statRes.reply(
            this.statsRequestMsg(
              'Invalid stats!',
              'You have a maximum of 5 points to allocate, and each stat must be within -5 to 5',
            )
          );
          i = await this.response(msg);
          return getNewPlayerStats();
        }
        charStats[stat] = parseInt(val);
      }


      if (total > 5) {
        // @ts-ignore
        const msg: Message = await statRes.reply(
          this.statsRequestMsg(
            'Invalid stats!',
            'You have a maximum of 5 points to allocate, and each stat must be within -5 to 5',
          )
        );
        i = await this.response(msg);
        return getNewPlayerStats();
      }

      return charStats as unknown as PlayerStats;
    };
    const charStats = await getNewPlayerStats();
    if (charStats instanceof Error) return charStats;

    const emptyEffects: Record<string, LingeringEffect[]> = {};
    Object.values(LingeringEffectKey).forEach(key => {
      emptyEffects[key] = [];
    })

    const player: PlayerData = {
      ...charDetails,
      health: 15,
      score: 0,
      stats: charStats,
      user: this.user.tag,
      effects: emptyEffects as Record<LingeringEffectKey, LingeringEffect[]>
    };

    if (statRes instanceof Error) return statRes;
    statRes?.reply({
      embeds: [this.playerToEmbedOptions(player)]
    });
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
    console.log(this.queuedEmbeds);
    try {
      await interaction.update({
        components: [],
        embeds: [
          ...interaction.message.embeds,
          ...this.retrieveQueuedEmbeds(),
          { title: `${playerData.name} chose to ${interaction.customId}` },
          this.resultToEmbedOptions(result),
          this.playerToEmbedOptions(playerData, {
            showDesc: false,
            showStats: true,
          }),
        ],
      });
    } catch (e) {
      console.error(e);
      return new Error('Something has gone wrong...');
    }
  }

  /*
  Message to prompt to continue playing or take a break
  */
  async nextEncounter() {
    const msg = await this.channel.send({
      components: [UserInterface.continueMessageActionRow],
    });
    const inter = await this.response(msg);
    (inter.message as Message).delete();
    return inter;
  }

  /*
  Message to send when the player dies
  */
  death() {
    this.niceMessage(
      'Oh no! You\'ve Died',
      'It\'s the end of the road for you numbskull. Never fear, there\'s plenty more Zumbor where that came from'
    );
  }

  /*
  Sends a message containing the player information
  */
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
          "customId": label,
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
          color: 3 //encounter.color || "FUCHSIA",
        },
      ],
    };
  }

  // Takes an Encounter result and converts it to embed options
  private resultToEmbedOptions(
    result: EncounterOptionResult,
  ): MessageEmbedOptions {
    const embed : MessageEmbedOptions = {
      title: result.title,
      description: result.text,
      color: result.type === EncounterResult.SUCCESS
        ? [20, 240, 60]
        : [240, 40, 20],
    }
    if (result.baseEffect) {
      embed.fields = [
        {
          name: result.baseEffect.name,
          value: (result.baseEffect.potency > 0 ? "+" : "") + result.baseEffect.potency.toString(),
          inline: true,
        }
      ]
    }
    return embed;
  }

  // Creates an embed object from the player options
  private playerToEmbedOptions(
    player: PlayerData,
    options?: { showStats?: boolean; showDesc?: boolean; showTitle?: boolean; },
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
        name: "Score",
        value: player.score.toString(),
        inline: true,
      });
      fields.push({
        name: "Health",
        value: player.health.toString(),
        inline: true,
      });
      for (const attr in player.stats) {
        fields.push({
          name: attr,
          value: player.stats[attr as Attribute].toString(),
          inline: true,
        });
      }
    }
    return {
      title: options.showTitle
        ? `${player.name} - ${player.user}`
        : undefined,
      description: options.showDesc ? player.description : undefined,
      color: [
        Math.min(Math.max(255 - (player.health / 20 * 255), 0), 255),
        Math.max(Math.min((player.health / 20) * 255, 255), 0),
        0,
      ],
      fields,
    };
  }


  private statsRequestMsg(title: string, description: string) {
    const optns: InteractionReplyOptions = {
      fetchReply: true,
      embeds: [{
        title,
        description,
      }],
      components: [
        new MessageActionRow({
          components: [
            new MessageButton({
              type: 2,
              customId: "character_stats",
              style: 1,
              label: "Choose Stats",
            }),
          ],
        }),
      ],
    };
    return optns;
  }

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
}
