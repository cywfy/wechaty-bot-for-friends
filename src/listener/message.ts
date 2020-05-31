const config = require('../../bot_config');
import { Message } from 'wechaty';
import { checkText } from '../servers/rules';

export async function onMessage(msg: Message) {
    if (msg.self()) {
        return;
    }
    console.log(`${msg.room()}: ${msg.from()} ${msg.from()?.id}-----${msg.text()}`);
    checkText(msg);
}