import { Contact, Message, Wechaty } from 'wechaty';
import { ScanStatus } from 'wechaty-puppet';
import { PuppetPadplus } from 'wechaty-puppet-padplus';
import QrcodeTerminal from 'qrcode-terminal';
import { onMessage, onError } from './listener';
const config  = require('../bot_config');

const puppet = new PuppetPadplus({
  token: config.token,
});

const bot = new Wechaty({
  puppet,
  name: config.bot_name,
});

bot
  .on('error', onError)
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      QrcodeTerminal.generate(qrcode, {
        small: true
      });
    }
  })
  .on('login', (user: Contact) => {
    console.log(`login success, user: ${user}`);
  })
  .on('message', onMessage)
  .on('logout', (user: Contact, reason: string) => {
    console.log(`logout user: ${user}, reason : ${reason}`);
  })
  .start();