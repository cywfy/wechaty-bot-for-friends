import { Message } from 'wechaty';
import { MessageType } from 'wechaty-puppet';
import { weatherServer } from '.';

const regex: {[propName: string]: any} = {
    '功能': (msg: Message) => getFeatures(msg),
    '天气': (msg: Message) => weatherServer(msg)
}

const getFeatures = async (msg: Message) => {
    const keys = Object.keys(regex);
    keys.shift();
    if (!keys.length) {
        await msg.say('对不起，暂时没有功能');
        return;
    }
    await msg.say(`目前已经实现的功能:\n${keys.toString().replace(',', '\n')}`);
}

export const checkText = async (msg: Message) => {
    const text = msg.text().trim();
    if(msg.type() === MessageType.Recalled) {
        const recalledMessage = await msg.toRecalled();
        await msg.say(`${msg.from()} 撤回了消息---${recalledMessage}`);
        return;
    }
    const keys = Object.keys(regex);
    keys.forEach((v, k) => {
        const reg = new RegExp(v);
        if (reg.test(text)) {
            regex[v](msg);
        }
    })
}

