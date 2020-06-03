import { Message } from 'wechaty';
import { setSth } from '../util';
const bot_info = require('../../bot_info.json');

export const adminServer = async (msg: Message) => {
    const fromId = msg.from()?.id;
    if (bot_info.adminId && fromId !== bot_info.adminId) {
        await msg.say('已存在管理员');
        return;
    }
    const text = msg.text().trim().replace(/控制\s*/, '');
    const res = setSth({
        adminId: msg.from()?.id
    });
    if (!res) {
        await msg.say('设置管理员失败');
    }
}