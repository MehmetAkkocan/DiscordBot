/**

//Discord bot : Save wallet address on google spreadsheet 

Important links:
	* Discord Developer Portal: https://discord.com/developers/applications
	* Discord.js official website: https://discord.js.org 
	* Discord Intents List: https://discord.com/developers/docs/topics/gateway#list-of-intents

 * Parses a string or buffer in the .env file format into an object.
 *
 * See https://docs.dotenv.org
 *
 * @param src - contents to be parsed. example: `TOKEN=OTQ0Mjcya23`
 * @param options - additional options. example: `{ debug: true }`
 * @returns an object with keys and values based on `src`. example: `{ TOKEN=OTQ0Mjcya23 }` 
 
const creds = require('./credentials.json');

const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet('TOKEN');

async function accessSpreadsheet() {
    try {
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();
    } catch (err: any) {
        console.log('Something Gone Wrong!');
    }
}

How To Get Credentials for Google Sheets : https://medium.com/@a.marenkov/how-to-get-credentials-for-google-sheets-456b7e88c430

**/
