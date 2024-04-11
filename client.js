/*

* Base ini di buat oleh KazeDevID

* Silahkan Apa in base ini, dan juga
* dimohon Jangan hapus kredit di bawah,
* terimakasih.


Contributor
• Kaze(base)
• Dika Ardnt(help)


*/
const {
BufferJSON,
WA_DEFAULT_EPHEMERAL,
generateWAMessageFromContent,
proto,
generateWAMessageContent,
generateWAMessage,
prepareWAMessageMedia,
getContentType
} = require('@whiskeysockets/baileys');
const fs = require("fs");
const util = require("util");
const chalk = require('chalk');
const { exec } = require('child_process');
const cron = require('node-cron');
const moment = require('moment-timezone');
const conpiq = require('./config.js')
const Func = require('./lib/index.js')

let prefix = conpiq.options.prefix
let mode = conpiq.options.public

module.exports = async (conn, m) => {
try {
const body = m.mtype === 'conversation' ? m.message.conversation : m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text : '';
const budy = typeof m.text === 'string' ? m.text : '';
const command = body.startsWith(prefix) ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : '';
const commandnya = command.replace(prefix, '');
const args = body.trim().split(/ +/).slice(1);
const q = question = args.join(' ');
const text = (question = args.join(" "));
const message = m;
const messageType = m.mtype;
const messageKey = message.key;
const pushName = m.pushName || 'Undefined';
const itsMe = m.key.fromMe
const chat = (from = m.chat);
const sender = m.sender;
const userId = sender.split("@")[0];
const reply = m.reply;

// Group
const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch((e) => {}) : "";
const groupName = m.isGroup ? groupMetadata.subject : "";
const participants = m.isGroup ? await groupMetadata.participants : ''

function toUpper(query) {
const arr = query.split(" ");
for (var i = 0; i < arr.length; i++) {
arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
}

return arr.join(" ");
}



if (body.startsWith('$')) {
if (!itsMe) return 
await m.reply('_Executing..._')
exec(q, async (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) {
await m.reply(`${stdout}`)
}
})
}

if (body.startsWith('>')) {
if (!itsMe) return 
try {
let evaled = await eval(q)
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}
}

if (body.startsWith('=>')) {
if (!itsMe) return 
function Return(sul) {
let sat = JSON.stringify(sul, null, 2)
if (sat) {
var bang = util.format(sat)
} else if (sat == undefined) {
var bang = util.format(sul)
}
return m.reply(bang)
}
try {
m.reply(util.format(eval(`(async () => { return ${q} })()`)))
} catch (e) {
m.reply(String(e))
}
}

if (!mode) {
if (!m.key.fromMe) return;
}

if (m.message) {
//conn.readMessages([m.key]);


console.log(
  chalk.bgMagenta(' [===>] '),
  chalk.cyanBright('Time: ') + chalk.greenBright(new Date()) + '\n',
  chalk.cyanBright('Message: ') + chalk.greenBright(budy || m.mtype) + '\n' +
  chalk.cyanBright('From:'), chalk.greenBright(pushName), chalk.yellow('- ' + m.sender) + '\n' +
  chalk.cyanBright('Chat Type:'), chalk.greenBright(!m.isGroup ? 'Private Chat' : 'Group Chat - ' + chalk.yellow(m.chat))
);

}

if (!body.startsWith(prefix)) {
return;
}

switch (commandnya) {

case "menu": 
case "help": {
try {
let text = `Hi, This is a list of available commands\n\n*Total Command :* ${Object.values(conpiq.menu).map(a => a.length).reduce((total, num) => total + num, 0)}\n\n`

Object.entries(conpiq.menu).map(([type, command]) => {
text += `\n`
text += `*${toUpper(type)} Menu*\n`
text += `\n`
text += ` ${command.map(a => `${prefix + a}`).join("\n ")}\n`
text += `\n`
}).join('\n\n')
return reply(text)
} catch (err) {
console.log(err)
}
}
break;

case 'changeline': 
case 'addline':
case 'tambahline':
case 'gantiline': {
let [inputs, inputs_, inputs__] = text.split("|")
if (!inputs) return reply('Enter the line');
if (!inputs_) return reply('Enter the text');
if (!inputs__) return reply('Enter the path');
try {
changeline(inputs, inputs_, inputs__)
reply('Succeed')
} catch (err) {
console.log(err)
reply('Error')
}
}
break;

case 'savefile': {
if (!text) return reply('What is the file name?')
if (!m.quoted.text) return reply(`reply to the message!`)
await fs.writeFileSync(text, m.quoted.text)
reply(`saved in ${text}`)
}
break;

case 'tes': {
reply('Ok!');
}
break;

default: {

const time = '0 0 */3 * * *'; 
  cron.schedule(time, () => {
    conn.sendMessage('6282217590187@s.whatsapp.net', { text : 'Pemberitahuan: Waktunya Login Akun Optiklink.'}, { quoted : m });
  });
  

const task = cron.schedule('0 0 * * 0', () => {
    const jakartaTime = moment().tz('Asia/Jakarta');
    conn.sendMessage('6282217590187@s.whatsapp.net', { text : `Pemberitahuan: Syalom, hari ini sudah hari Minggu, ${jakartaTime.format('LLL')} waktu Jakarta, Jangan lupa pergi beribadah yah!.`}, { quoted : m });
  }, {
    timezone: 'Asia/Jakarta'
  });
  task.start();
  
}
}
} catch (err) {
    m.reply(util.format(err));
  }
}


let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});