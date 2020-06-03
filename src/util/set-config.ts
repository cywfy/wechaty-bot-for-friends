import path from 'path';
import fs from 'fs';

const bot_info_path = path.join(__dirname, '../../bot_info.json');

const checkExits = async (filePath: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            await fs.access(filePath, async err => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        await fs.writeFile(filePath, JSON.stringify({}), err => {
                            if (err) {
                                console.log('创建文件失败: '+ err);
                                throw err;
                            }
                            resolve(true)
                        })
                    } else {
                        throw err;
                    }
                }
            })
        } catch (error) {
            reject(false)
            console.log(error);
        }
    })
}

const writeConfig = (bot_info_path: string, params: {}): Promise<boolean> => new Promise(async (resolve, reject) => {
    await fs.writeFile(bot_info_path, JSON.stringify(params), err => {
        if (err) {
            resolve(false);
        }
        resolve(true);
        console.log('写入成功')
    })
})

const readFile = (bot_info_path: string): Promise<any> => new Promise(async(resolve) => {
    await fs.readFile(bot_info_path, 'utf8', (err, data) => {
        if (err) resolve({});
        resolve(JSON.parse(data));
    })
})

export const setSth = async (params: {[propName: string]: any}): Promise<boolean> => {
    // const bool = await checkExits(bot_info_path);
    // console.log('bool:', bool)
    // if (!bool) {
    //     console.log('失败');
    //     return false;
    // }
    const info = await readFile(bot_info_path);
    if (!info) return false;
    Object.keys(params).forEach((v) => {
        if (info[v] !== params[v]) {
            info[v] = params[v];
        }
    });
    const res = await writeConfig(bot_info_path, info);
    return res;
}

type total = {
    [propName: string]: string
}

export const removeSth = async (key: string) => {
    let info = await readFile(bot_info_path);
    if (!info) return false;
    info = Object.keys(info).reduce((t: total, v) => {
        if (v !== key) {
            t[v] = info[v];
        }
        return t;
    }, {});
}