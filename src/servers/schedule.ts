import schedule from 'node-schedule';
import { Message } from 'wechaty';
import * as fs from 'fs';
import * as path from 'path';

const bot_task_path = path.join(__dirname, '../../bot_task.json');

interface ScheduleTask {
    rule: string,
    name: string,
    context: string
}

interface ScheduleTaskStorage extends ScheduleTask {
    from: string,
    id: string,
    time: number,
    runTimes: number,
    room?: string,
}

export class Schedule {
    private static instance: any;

    static taskList: {[propName: string]: any};

    getInstance() {
        if (!Schedule.instance) {
            Schedule.instance = new Schedule();
            Schedule.init();
        }
        return Schedule.instance;
    }

    constructor() {
        return this.getInstance()
    }

    static init() {
        Schedule.checkFile();
    }

    private static async checkFile() {
        try {
            await fs.access(bot_task_path, async err => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        await fs.writeFile(bot_task_path, JSON.stringify({}), err => {
                            if (err) {
                                console.log('创建文件失败: '+ err);
                            }
                        })
                    }
                } else {
                    await fs.readFile(bot_task_path, 'utf8', (err, data) => {
                        if (err) throw err;
                        console.log(data);
                        Schedule.taskList = JSON.parse(data);
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    /**
     * 
     * @param key 任务id
     * @param fn  任务
     * @param rule 执行规则
     * * * * * * *
        ┬ ┬ ┬ ┬ ┬ ┬
        │ │ │ │ │ |
        │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
        │ │ │ │ └───── month (1 - 12)
        │ │ │ └────────── day of month (1 - 31)
        │ │ └─────────────── hour (0 - 23)
        │ └──────────────────── minute (0 - 59)
        └───────────────────────── second (0 - 59, OPTIONAL)
     */
    async addTask(key: string, options: ScheduleTask, msg: Message) {
        if (Schedule.taskList[key]) {
            await msg.say(`不能重复添加任务`);
            return;
        } 
        const params = {

        }
        Schedule.taskList[key] = params;
        await msg.say(`添加任务：${key} 成功`);
        await this.runTask(key, msg);

    }

    async removeTask(key: string, msg: Message) {
        if (Schedule.taskList[key]) {
            delete Schedule.taskList[key];
            await msg.say('删除任务成功');
        }
    }

    async runTask(key: string, msg: Message) {
        const task = Schedule.taskList[key];
        if (task.isRun) {
            await msg.say('该任务已经执行');
            return;
        }
        Schedule.taskList[key].taskCb = schedule.scheduleJob(task.rule, function() {
            Schedule.taskList[key].isRun = true;
            Schedule.taskList[key].runTimes ++;
        });
        await msg.say(`执行任务：${key} 成功`);
        if (Schedule.taskList[key].time === Schedule.taskList[key].runTimes) {
            this.removeTask(key, msg);
        }
    }
}