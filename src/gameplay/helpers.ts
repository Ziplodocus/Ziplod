import { MessageOptions, TextBasedChannel } from "discord.js";

export const rollD = (num: number) => {
  return Math.ceil(Math.random() * num);
};

export const rollCheck = (threshold: number, modifier: number) => {
  let roll = rollD(20);

  const success = (() => {
    switch (roll) {
      case 1:
        return false;
      case 20:
        return true;
      default:
        return roll + modifier >= threshold;
    }
  })();

  const critical = (roll === 1 || roll === 20) ? true : false;

  return {
    success,
    critical,
  };
};

export class EventEmitter {
  private _events: { [name: string]: ((event: any) => any)[]; };
  constructor() {
    this._events = {};
  }
  on(name: string, callback: (event: any) => any): void {
    this._events[name]
      ? this._events[name].push(callback)
      : this._events[name] = [callback];
  }
  trigger(name: string, event: any): void {
    this._events[name]?.forEach((callback) => callback(event));
  }
  off(name: string, callback: (event: any) => any): void {
    const index = this._events[name].indexOf(callback);
    if (index === -1) return;
    this._events[name].splice(index, 1);
  }
}

export function waitUntilEvent(
  item: any,
  event: string,
): Promise<any> {
  return new Promise((resolve) => {
    const listener = (i: any) => {
      item.off(event, listener);
      resolve(i);
    };
    item.on(event, listener);
  });
}

export function getChannelMessager(channel: TextBasedChannel) {
  return function(title: string, description?: string, additionalMessageOptions?: MessageOptions) {
    return channel.send({
      ...additionalMessageOptions,
      embeds: [{ title, description }]
    });
  };
}