import * as fs from 'fs';
import * as path from 'path';
import { setBaseDir } from '../util';

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
async function onLogin(user: any) {
    console.log(`贴心小助理${user}登录了`);

    // Service.instance().setBot(bot);

    const tempDir = path.join(process.cwd(), './temp/image');
    mkdirsSync(tempDir);
    setBaseDir(tempDir);
    
}
export default onLogin;