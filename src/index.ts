import { Contact, Message, Wechaty } from 'wechaty';
import { ScanStatus } from 'wechaty-puppet';
import { PuppetPadplus } from 'wechaty-puppet-padplus';
import QrcodeTerminal from 'qrcode-terminal';
import { onMessage, onError, onFriendShip, onLogin } from './listener';
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
  .on('login', (user: Contact) => onLogin(user, bot))
  .on('message', onMessage)
  .on('friendship', onFriendShip)
  .on('logout', (user: Contact, reason: string) => {
    console.log(`logout user: ${user}, reason : ${reason}`);
  })
  .start();