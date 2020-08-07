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
let idMsg1 = "";

client.on('ready', () => {
    console.log("Bot started!");
    id = client.user.id;
    idMsg = "<@!"+id+">";
    idMsg1 = "<@"+id+">";
    client.shard.fetchClientValues('guilds.cache.size').then(results => {
        client.user.setPresence({ activity: { name: 'on '+results.reduce((acc, guildCount) => acc + guildCount, 0)+" servers." }, status: 'online' });
    });
    setInterval(function() {
        client.shard.fetchClientValues('guilds.cache.size').then(results => {
            client.user.setPresence({ activity: { name: 'on '+results.reduce((acc, guildCount) => acc + guildCount, 0)+" servers." }, status: 'online' });
        });
    }, 3600000);
});

client.on('guildCreate', async guild => {
    props.addNewGuild(guild.id);
});

client.on('message', async msg => {
    if(msg.author.bot) return;

    if(!props.guildList.hasOwnProperty(msg.guild.id)) props.addNewGuild(msg.guild.id);

    let content = "";
    if(msg.content.trim().startsWith(idMsg)){
        content = splitOnce(msg.content.trim(), idMsg)[1].trim();
    }
    else if(msg.content.trim().startsWith(idMsg1)){
        content = splitOnce(msg.content.trim(), idMsg1)[1].trim();
    }
    else if(msg.content.trim().startsWith(props.guildList[msg.guild.id].prefix)){
        content = splitOnce(msg.content.trim(), props.guildList[msg.guild.id].prefix)[1].trim();
    }
    else return props.testJob(msg.guild, msg.channel);
    if(content === "") return props.testJob(msg.guild, msg.channel);

    let split = splitOnce(content, " ");
    let prefix = props.guildList[msg.guild.id]["prefix"];
    let cmd = split[0].toLowerCase().trim();
    let arg = split[1].trim();

    if(!cmd.startsWith("help") && !cmd.startsWith("addmessage") && !cmd.startsWith("deletemessage") && !cmd.startsWith("messages") && !cmd.startsWith("prefix")) return props.testJob(msg.guild, msg.channel);

    switch(cmd){
        case "help":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            commands.helpCommand(msg.channel);
            break;
        case "addmessage":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            if(split.length === 1) return msg.reply("usage: "+prefix+"addMessage <data>");
            if(commands.addMessage(msg.channel, msg.guild, arg)) msg.delete();
            break;
        case "deletemessage":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            if(split.length === 1) return msg.reply("usage: "+prefix+"deleteMessage <id>");
            if((await commands.deleteMessage(msg.channel, msg.guild, arg))) msg.delete();
            break;
        case "messages":
            if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
            commands.messages(msg.channel);
            break;
        case "prefix":
            if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply("you must have the Administrator permission to use this command!");
            if(split.length === 1) return msg.reply("usage: "+prefix+"prefix <prefix>");
            if(commands.prefix(msg.guild, arg)) msg.reply("prefix updated!");
            break;
    }
});

function splitOnce(inp, delim){
    let arr = inp.split(delim);
    return [arr.shift(), arr.join(delim)];
}

client.login(process.env.TOKEN);