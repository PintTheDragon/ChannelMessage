require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client();

const props = require("./guildProps.js");
props.index = this;
props.setupMysql();
const commands = require("./commands.js");
commands.Discord = Discord;
commands.props = props;

let id = "";
let idMsg = "";

client.on('ready', () => {
    console.log("Bot started!");
    id = client.user.id;
    idMsg = "<@!"+id+">";
});

client.on('guildCreate', async guild => {
    props.addNewGuild(guild.id);
});

client.on('message', async msg => {
    if(msg.author.bot) return;

    if(!props.guildList.hasOwnProperty(msg.guild.id)) props.addNewGuild(msg.guild.id);

    props.testJob(msg.guild, msg.channel);

    let content = "";
    if(msg.content.trim().startsWith(idMsg)){
        content = msg.content.trim().split(idMsg)[1].trim().replace("\n", "");
    }
    else if(msg.content.trim().startsWith(props.guildList[msg.guild.id].prefix)){
        content = msg.content.trim().split(props.guildList[msg.guild.id].prefix)[1].trim().replace("\n", "");
    }
    else return;
    if(content === "") return;

    let split = content.split(/\s(.+)/);
    let prefix = props.guildList[msg.guild.id]["prefix"];
    switch(split[0].toLowerCase().trim()){
        case "help":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            commands.helpCommand(msg.channel);
            break;
        case "addmessage":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            if(split.length === 1) return msg.reply("usage: "+prefix+"addMessage <data>");
            if(commands.addMessage(msg.channel, msg.guild, split[1].trim())){
                msg.reply("message added!");
                msg.delete();
            }
            break;
        case "deletemessage":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            if(split.length === 1) return msg.reply("usage: "+prefix+"deleteMessage <id>");
            if(commands.deleteMessage(msg.guild, split[1].trim())){
                msg.reply("message deleted!");
                msg.delete();
            }
            break;
        case "messages":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            commands.messages(msg.channel);
            break;
        case "prefix":
            if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply("you must have the Administrator permission to use this command!");
            if(split.length === 1) return msg.reply("usage: "+prefix+"prefix <prefix>");
            if(commands.prefix(msg.guild, split[1].trim())) msg.reply("prefix updated!");
            break;
    }
});

client.login(process.env.TOKEN);