const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUUZpTnFOeFdvUG52V1V0Nnc4bXhGQzV1VWx6dnhBUWdPZU9HR05ubDVHQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV05BZWZReTN2OUR0NEFsS0YzYVhiS2xoMC9kcDR6aDZWMWtyeEpMaHVoUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTTVZsQ0trRVZLcTdQZitkZC9ZUnA5dmVYT0VtUFNxUUJEdGpwcUw4UW40PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI1L00zWHVPSGFueUY3ZWZ5MGJLKzNFMjl0bE0ydlA5QVUreDF5MmlJVEJzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFHcklIanJxTVIrN25lbDFCNHl0dXRaNkhyQ1dNUjJhYlVHeDYzM0ZPMDg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjMyVWF4VTA3T094eUZlMUV2eE5nUG1kd3dOZk1HNitIWEpHWllpRWFMdzQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0NIb1V4bStWUE5UUEpYU3h4cGZqWTdidDJrTnJsS2l3M0tKdjltbWtsRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidTJNSzNUS1BMSDg4c1A1UW1VZmhLS3NSS3pMSFV0UmU3MDUwT3FOclJuZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhCOEtWenlNMjhRVkMrWXBOc1NwdWpXQnJTZGJRODIvRmlucTRCcWFpOVVzcHdJOExFQ1ZNbzhTck0yUmVKVEdmZmx1VldQTkUyQTZRemk4RFA2TERBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTQ2LCJhZHZTZWNyZXRLZXkiOiIvdEYva2JsV01zbGRsb1JPVk1tMFd6Rjlod2hLaTBNdjZncmV0V25wRWN3PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiIwY2VsYmtraVFjV3N0SXhwTzVITk1RIiwicGhvbmVJZCI6IjY4NmFhMWFjLWUyYzAtNDc3Ni1iODAwLTZmODA5MTQ0NmUxYSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI5cW91UFp0di92Z05WS1JPcVhnNG80UU9lN3c9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY05Kdmx3QW5pU3h2NG1HQTZoZllSdVM0cmtzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IllaNEYzMkZZIiwibWUiOnsiaWQiOiI5NDc1NzU4NjkxMTo5M0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTm41aWVrSEVQZmU0N2tHR0FjZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMTNCODdzNG5NM1Y0NkZoeUVxZnlqUWd4UGxOUGhOWm1NZzFDeU9kN3NoWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiVjlLOHhpMmc4Sjdad0FUSHVqK2hZMkJoMFVuaEQwdDVPKzA3OGxOZmxMalFDTzM2bitvK0M3WDRidWI4Rmx2U2lxMmhsSDhsbDR1WHNlOG1oeCtQQXc9PSIsImRldmljZVNpZ25hdHVyZSI6Ilhha3lHQm1aVWNCT0JjQ0VEc25obVVCSFcxRHJrQ2tiR2t0VXNOQmxPZzdxWlBiTXROQ3RNNUd5dUNkNEZLQjJ4SmFwNVdNeFdRbUZyWEwwQll4MURnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NTc1ODY5MTE6OTNAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZGR3Zk83T0p6TjFlT2hZY2hLbjhvMElNVDVUVDRUV1pqSU5Rc2puZTdJVyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczMTc4NDU4MiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFPNGwifQ==',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "🍂🖤𝗞𝗜𝗡𝗚 𝗔𝗡𝗝𝗔𝗡𝗔 𝗕𝗕𝗛 💦🥵🍂",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94760105256",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/nbfmw2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
