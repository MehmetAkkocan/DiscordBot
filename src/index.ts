import DiscordJs, { Intents } from 'discord.js';
import dotenv from 'dotenv';


dotenv.config();
const creds = require('./credentials.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('');
const prefix = '!';
const submitCommand = 'submit';

const client = new DiscordJs.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})
async function accessSpreadsheet() {
    try {
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();
    } catch (err: any) {
        console.log('Something Gone Wrong! Try Again Later.');
    }
}
const addWallet = async (name: any, wallet: any, message: any) => {
    try {
        accessSpreadsheet();
        const sheet = doc.sheetsByIndex[0];
        let row = {
            Discord_Name: name,
            Wallet_Adress: wallet
        }

        const rows = await sheet.getRows();
        if (rows.some((x: any) => x.Discord_Name === name)) {

            return message.reply(`\nAlready submitted! Your wallet is : ${rows.find((e: any) => e.Discord_Name === name).Wallet_Adress} . If you want to change your wallet adress, type : !update yourwalletadress`);
        }
        else {
            message.reply(`\nWell Done!`);
            return sheet.addRow(row);
        }
    } catch (err: any) {
        return message.reply('Something Gone Wrong! Try Again Later.');
    }
}

const checkWallet = async (name: any, message: any) => {
    try {
        accessSpreadsheet();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        if (rows.some((x: any) => x.Discord_Name === name)) {

            return message.reply(`\nAlready submitted! Your wallet is : ${rows.find((e: any) => e.Discord_Name === name).Wallet_Adress} .`);
        }
        else {
            message.reply(`\nNot found any recorded wallet!\n Type: !submit (your wallet adress)`);
        }

    } catch (err: any) {
        return message.reply('Something Gone Wrong! Try Again Later.');
    }


}
const updateWallet = async (name: any, wallet: any, message: any) => {
    try {
        accessSpreadsheet();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        rows.filter((e: any) => {
            if (e.Discord_Name == name) {
                e.Wallet_Adress = wallet;
                e.save();
                message.reply(`Your wallet updated!`);
            }

        })
    } catch (err: any) {
        return message.reply('Something Gone Wrong! Try Again Later.');
    }
}

client.on('ready', () => {
    console.log('Bot Ready!');
    accessSpreadsheet();
})


client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;
    if (message.content.startsWith(prefix) == false) return;

    if (message.content.toLowerCase().startsWith('!help')) {
        message.reply("\nType: \n !submit (your wallet adress) \nor\n !update (your wallet adress) \nor\n !check");
    }

    if (message.content.toLowerCase().startsWith('!submit')) {

        const args = message.content.slice((prefix + submitCommand).length).trim();
        addWallet(`${message.author.username + '#' + message.author.discriminator}`, args, message);

    }
    if (message.content.toLowerCase().startsWith('!update')) {

        const args = message.content.slice((prefix + submitCommand).length).trim();
        updateWallet(`${message.author.username + '#' + message.author.discriminator}`, args, message);

    }
    if (message.content.toLowerCase().startsWith('!check')) {
        checkWallet(`${message.author.username + '#' + message.author.discriminator}`, message);

    }


})


client.login(process.env.TOKEN);