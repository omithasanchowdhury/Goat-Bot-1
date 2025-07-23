const fs = require("fs");
const path = __dirname + "/cache/kamlaOn.json";

module.exports = {
  config: {
    name: "kamla",
    version: "1.0",
    author: "rishi",
    description: "Tag someone to kamla-mode and insult them automatically when they chat",
    commandCategory: "fun",
    usages: "[on/off @tag]",
    cooldowns: 5,
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, mentions } = event;

    if (!fs.existsSync(path)) fs.writeFileSync(path, "[]", "utf-8");
    let kamlaList;
    try {
      kamlaList = JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch {
      kamlaList = [];
    }

    if (args.length === 0) {
      return api.sendMessage(
        `⚠️ Usage:\n.kamla on @user - কামলা মোড চালু করবে\n.kamla off - কামলা মোড বন্ধ করবে`,
        threadID,
        messageID
      );
    }

    const command = args[0].toLowerCase();

    if (command === "off") {
      const updatedList = kamlaList.filter(e => e.threadID !== threadID);

      fs.writeFileSync(path, JSON.stringify(updatedList, null, 2), "utf-8");
      return api.sendMessage(
        "🥱 কামলা মোড এখন বন্ধ! কেউ গালি পাবে না।",
        threadID,
        messageID
      );
    }

    if (command === "on") {
      if (!mentions || Object.keys(mentions).length === 0) {
        return api.sendMessage(
          "🤓 কারো নাম ট্যাগ করো যাকে কামলা মোডে রাখতে চাও।",
          threadID,
          messageID
        );
      }

      const mentionID = Object.keys(mentions)[0];

      const exists = kamlaList.some(
        e => e.threadID === threadID && e.userID === mentionID
      );

      if (exists) {
        return api.sendMessage(
          `😒 ${mentions[mentionID].replace("@", "")} তো আগেই কামলা মোডে আছে!`,
          threadID,
          messageID
        );
      }

      kamlaList.push({ threadID, userID: mentionID });
      fs.writeFileSync(path, JSON.stringify(kamlaList, null, 2), "utf-8");

      return api.sendMessage(
        `😈 ${mentions[mentionID].replace("@", "")} এখন থেকে কামলা মোডে! কথা বললেই গালি পাবে!`,
        threadID,
        messageID
      );
    }

    return api.sendMessage(
      `⚠️ Usage:\n.kamla on @user - কামলা মোড চালু করবে\n.kamla off - কামলা মোড বন্ধ করবে`,
      threadID,
      messageID
    );
  },

  onChat: async function({ api, event }) {
    if (!event.isGroup) return;

    if (!fs.existsSync(path)) return;

    let kamlaList;
    try {
      kamlaList = JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch {
      kamlaList = [];
    }

    const isKamla = kamlaList.some(
      e => e.threadID === event.threadID && e.userID === event.senderID
    );

    if (!isKamla) return;

    const insults = [
      "তুই এমন কামলা, গুগলে নাম সার্চ দিলে 'ধিক্কার' আসে 🤡",
      "তুই এমন অপদার্থ, WiFi তোরে কানেক্ট হতে লজ্জা পায় 📶🚫",
      "তুই গর্ভপাত মিস হয়ে যাওয়া একটা ব্যর্থতা 😵",
      "তুই মানুষ না, অপশনাল ভুল! ❌",
      "তোর IQ দেখলে চায়ের কাপে বুদবুদও হাসে ☕😂",
      "তুই এমন বাজে, পিঁপড়াও তোকে খেতে চায় না 🐜🤮",
      "তুই এমন গরীব মগজের মালিক, চুলকানোর ক্ষমতাও নাই 🧠🚫",
      "তোরে দেইখ্যা depression increase হয় 📉🫠",
      "তুই জন্মেছিস ভুল করে, মরতেও ভুল করবি 🤬",
      "তুই এমন এক্সট্রা, ডিরেক্টর তোকে স্ক্রিপ্ট থেকে কেটে ফেলেছে 🎬❌",
      "তোরে অপমান করতে গিয়েও অপমান নিজেরে বেইজ্জতি মনে করে 😒",
      "তুই তেল ছাড়া ভাজা, কিছুর দাম নাই 🍳🤢",
      "তুই পচা এমন যে তোর উপর জমে থাকা ধুলাও তোকে ছেড়ে যায় 🧹🫥",
      "তুই ফাঁকা কলসি, শব্দ ছাড়া আর কিছু নাই 🔔",
      "তুই এমন কামলা, ভূতও তোকে বাঁচায় না 👻",
      "তুই জন্মে পাপ করছিস, বেঁচে থাকায় সমাজ পচছে ☠️",
      "তুই এমন বাজে, তোর ছায়াও তোকে এড়ায় 🫣",
      "তুই জন্মানোর সময় ভুল করে আসমান থাইকা পড়ে গেছিস 🤢🙂",
      "তুই ফরমালিন ছাড়া পঁচা 🤮",
      "তুই এমন কামলা, ডাক্তার তোকে দেখে হাত ধুয়ে ফেলছে 🧼🩺",
      "তোর মুখে থুতু দিলেও পানি অপমানিত বোধ করে 💦😷",
      "তুই এমন লেভেলের পঁচা, তোরে ধরলে Dettol-ও কাজ করে না 🧴❌",
      "তুই এমন ব্যর্থতা, তোকে দেখলে গর্ভই লজ্জা পায় 🤰😓",
      "তোর মতো অপদার্থ দুনিয়ায় একটাই কপি, সেটাও ভাঙা 📄💔",
      "তুই পঁচা এমন, মরার পরেও তোকে পচা বলে ঘোষণা দেয় 😵‍💫",
      "তুই এমন নীচ, নরকেও তোকে ঠাঁই দেয় না 🔥🙅"
    ];

    const pick = () => insults[Math.floor(Math.random() * insults.length)];
    const insultMsg = `${pick()}\n${pick()}`;

    return api.sendMessage(insultMsg, event.threadID, event.messageID);
  }
};
