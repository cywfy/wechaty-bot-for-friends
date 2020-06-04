import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

const entryMD5 = async (str: string):Promise<string> => {
    return crypto.createHash('md5').update(str + new Date().getTime()).digest('base64');
};

async function checkPath(fileName: string, fileExt:string = 'png') {
    const filePath = path.join(__dirname, '../../temp/image', `${(fileName)}.${fileExt}`);
    await fs.access(filePath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.error('文件不存在');
            fs.mkdirSync('../../temp/image/')
          }     
        }
      
        fs.unlink(filePath,function(error){
            if(error){
                console.log(error);
                return false;
            }
            console.log('删除同名文件成功');
        });
    });
    return filePath;
}