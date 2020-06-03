import { Message } from 'wechaty';

const createRegex = (reg: string):RegExp => {
    return new RegExp(reg);
}

const store: {[propName: string]: {[propName: number]: any}} = {};

export const taskServer = async (msg: Message) => {
    const room = msg.room();
    const text = msg.text();
    const from = msg.from();
    const id = from!.id;
    let roomId: string | undefined;
    if (room) {
        roomId = room?.id;
        console.log(msg.room()?.id);    
    }
    console.log(msg.from()?.id);
    console.log(store)
    if (!store[id]) {
        store[id] = {};
        await msg.say('请随后输入所要执行的任务名');
        return
    }
    if (createRegex('任务\s*').test(text.trim())) {
        const len = Object.keys(store[id]).length;
        const name = text.trim().replace(/任务\s*/, '');
        store[id][len] = {
            name
        }
        await msg.say('请设置任务执行规则(任务名：例如(定时天气：每天9点)，规则可以每周每月每秒)');
    }
}