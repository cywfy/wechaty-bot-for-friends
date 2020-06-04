import * as fs from 'fs';
import * as path from 'path';
import { Contact, Wechaty } from 'wechaty';
import { setSth } from '../util';

function mkdirsSync(dirname: string) {
    if (fs.existsSync(dirname)) {
        return true;
    }

    if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }

    return false;
}

/**
 * @description 您的机器人上线啦
 * @param {} user 
 */
export async function onLogin(user: Contact, bot: Wechaty) {
    console.log(`bot: ${user} 登录成功`);

    const res = setSth({
        name: bot.userSelf().name(),
        id: bot.userSelf().id
    });
    if (!res) console.log('[login.ts/30: ]: ', );

    const tempDir = path.join(process.cwd(), './temp/image');
    mkdirsSync(tempDir);    
}