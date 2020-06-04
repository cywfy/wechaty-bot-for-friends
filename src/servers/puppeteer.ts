import { Message } from 'wechaty';
import path from 'path';
import dayjs from 'dayjs'

const puppeteer = require('puppeteer');
const botInfo = require('../../bot_info.json');

const BUILD_TIMES: number = 60 * 1000;
let timer: any;

const PROJECT_LIST: {[propName: string]: string} = {
    
}

const projectList = ():string => Object.keys(PROJECT_LIST).reduce((t, v) => (t += `${v}\n`, t), '\n');

export const startBuild = (project: string): Promise<boolean> => new Promise(async (resolve) => {
    let brower:any;
    try {
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            throw new Error('编译超时');
        }, BUILD_TIMES)
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  正在创建实例...`);
        brower = await puppeteer.launch();
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  正在创建page...`);
        const page = await brower.newPage();
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  正在加载登陆页面......`);
        await page.goto('');
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  加载登陆页面成功，正在进行账号输入`);
        await page.type('#username', '');
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  账号输入成功，正在进行密码输入`);
        await page.type('#password', '');
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  密码输入成功，即将进行登陆`);
        await page.click('.btn-submit');
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  点击登陆中...正在进行登陆后的跳转`);
        await page.goto(PROJECT_LIST[project]);
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  跳转成功`);
        await page.waitFor(() => !!document.querySelector('.task-link'));
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  即将点击编译`);
        await page.click('.icon-clock.icon-md');
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}  点击编译成功，稍后进行截图...`);
        await page.waitFor(500);
        await page.screenshot({path: path.join(__dirname, `../../temp/image/${project}-${new Date().getTime()}.png`)});
        await brower.close();
        clearTimeout(timer);
        timer = undefined;
        resolve(true);
    } catch (error) {
        await brower.close();
        resolve(false);
        console.log(error)
    }
})

export const puppeteerServer = async (msg: Message) => {
    if (timer) {
        await msg.say('正在执行上一个任务');
        return;
    }
    let text = msg.text().trim();
    text = text.replace(/编译\s*/, '').replace(`@${botInfo.name}`, '').trim();
    const keys = Object.keys(PROJECT_LIST);
    const pro = keys.filter(v => new RegExp(v).test(text));
    if (!pro.length) {
        await msg.say('未找到匹配的项目,可以试试如下几个项目:' + projectList());
        return;
    }
    console.log('--before build--')
    const bool = await startBuild(pro[0]);
    if (bool) {
        console.log(`编译 ${text} 成功`);
        await msg.say(`编译 ${text} 成功`);
    } else {
        console.log(`编译 ${text} 失败`);
        await msg.say(`编译 ${text} 失败`);
    }
}

export const stopBuild = async (msg: Message) => {

}