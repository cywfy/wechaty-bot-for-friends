import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { http } from './';

let baseDir: string = process.cwd();

export function setBaseDir(value: string) {
        baseDir = value;
    }
export function download(link: string, saveFilePath?: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        const href = link;
        const parsedURL = url.parse(href);

        // if filepath is not passed, generate a filename based on the url joined by '_' characters
        let filepath: string | undefined = saveFilePath || parsedURL?.pathname?.split('/').join('_');
        console.log('[download-image.ts/16] filepath: ', filepath);
        
        if (!filepath) {
            return resolve();
        }
        
        filepath = path.isAbsolute(filepath) ? filepath : path.join(baseDir, filepath);
        if (!filepath) {
            return resolve();
        }

        const writer = fs.createWriteStream(filepath);
        console.log('downloading', href, '...');
        http.get(href, {
            responseType: 'stream'
        }).then((res) => {
            console.log('[download-image.ts/37] download success: ');
            res.data.pipe(writer);
        }).catch(() => {
            console.log('[download-image.ts/41] download fail with error: ');
        });
        writer.on('finish', () => {
            resolve(filepath);
        });
        writer.on('error', reject);
    });
}