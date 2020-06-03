import { Message } from 'wechaty';
import { checkText } from '../servers/rules';
const botInfo = require('../../bot_info.json');

const regex = new RegExp(`@${botInfo.name}\\s*`);

export async function onMessage(msg: Message) {
    if (msg.self()) {
        return;
    }
    console.log(`${msg.room()}: ${msg.from()} ${msg.from()?.id}--${msg.to()}---${msg.text()}`);
    checkText(msg);
}