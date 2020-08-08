module.exports.Discord = null;
module.exports.props = null;

module.exports.idMsg = "";
module.exports.idMsg1 = "";

module.exports.commands = {};

module.exports.helpCommand = function(msg, split, arg, prefix){
    if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
    msg.channel.send({embed: new module.exports.Discord.MessageEmbed()
        .setColor("#0c9ba8")
        .setTitle("Commands")
        .setDescription("Here are all the commands in this bot.")
        .addField(prefix+"help", "Gives a list of every command.", true)
        .addField(prefix+"addMessage <message data>", "Adds a message (get message data from https://discohook.org/?message=eyJtZXNzYWdlIjp7ImVtYmVkcyI6W3t9XX19). Run in the channel you want the message to appear in.", true)
        .addField(prefix+"deleteMessage <id>", "Removes a message.", true)
        .addField(prefix+"messages", "Gives a list of every message.", true)
        .addField(prefix+"prefix <prefix>", "Sets the prefix.", true)
    });
}

module.exports.addMessage = function(msg, split, arg, prefix){
    if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
    if(split.length === 1) return msg.reply("usage: "+prefix+"addMessage <data>");
    try {
        let index = Math.max(...Object.keys(module.exports.props.guildList[msg.guild.id]["jobs"]));
        if(index === Number.NEGATIVE_INFINITY) index = 0
        module.exports.props.guildList[msg.guild.id]["jobs"][index+1] = {lastId: null, channelId: msg.channel.id, data: JSON.parse(arg.replace("\n", ""))};
        module.exports.props.saveGuild(msg.guild.id);
        module.exports.props.testJob(msg.guild, msg.channel);
        return msg.delete();
    }
    catch(e){
        msg.channel.send("Invalid data!");
    }
}

module.exports.deleteMessage = async function(msg, split, arg, prefix){
    if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
    if(split.length === 1) return msg.reply("usage: "+prefix+"deleteMessage <id>");
    try {
        if(!module.exports.props.guildList[msg.guild.id]["jobs"].hasOwnProperty(arg)) msg.channel.send("Invalid id!");
        let messageId = module.exports.props.guildList[msg.guild.id]["jobs"][arg]["lastId"];
        if(messageId != null) {
            let message = await msg.channel.messages.fetch(messageId);
            if (message) message.delete();
        }
        delete module.exports.props.guildList[msg.guild.id]["jobs"][arg];
        module.exports.props.saveGuild(msg.guild.id);
        return msg.delete();
    }
    catch(e){
        msg.channel.send("Invalid id!");
    }
}

module.exports.messages = function(msg, split, arg, prefix){
    if(!(msg.member.hasPermission('ADMINISTRATOR') || msg.member.hasPermission('MANAGE_MESSAGES'))) return msg.reply("you must have the Manage Messages permission to use this command!");
    let embed = new module.exports.Discord.MessageEmbed()
        .setColor("#0c9ba8")
        .setTitle("Messages")
        .setDescription("List of messages.");
    let jobs = module.exports.props.guildList[msg.channel.guild.id]["jobs"];
    Object.keys(jobs).forEach(key => {
       embed.addField("Id: "+key, "Channel: <#"+jobs[key]["channelId"]+">", true);
    });
    msg.channel.send({embed: embed});
}

module.exports.prefix = function(msg, split, arg, prefix){
    if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply("you must have the Administrator permission to use this command!");
    if(split.length === 1) return msg.reply("usage: "+prefix+"prefix <prefix>");
    module.exports.props.guildList[msg.guild.id]["prefix"] = arg;
    module.exports.props.saveGuild(msg.guild.id);
    return msg.reply("prefix updated!");
}

module.exports.split = function(msg){
    let content = "";
    if(msg.content.trim().startsWith(module.exports.idMsg)){
        content = splitOnce(msg.content.trim(), module.exports.idMsg)[1].trim();
    }
    else if(msg.content.trim().startsWith(module.exports.idMsg1)){
        content = splitOnce(msg.content.trim(), module.exports.idMsg1)[1].trim();
    }
    else if(msg.content.trim().startsWith(module.exports.props.guildList[msg.guild.id].prefix)){
        content = splitOnce(msg.content.trim(), module.exports.props.guildList[msg.guild.id].prefix)[1].trim();
    }
    else return false;
    if(content === "") return false;

    let split = splitOnce(content, " ");

    return [split.filter(Boolean), split[0].toLowerCase().trim(), split[1].trim(), module.exports.props.guildList[msg.channel.guild.id]["prefix"]];
}

module.exports.runCommand = function(msg){
    try {
        let split, cmd, arg, prefix;
        let res = module.exports.split(msg);
        if(res === false) return false;
        [split, cmd, arg, prefix] = res;

        if (!module.exports.commands.hasOwnProperty(cmd)) return false;
        module.exports.commands[cmd](msg, split, arg, prefix);
        return true;
    }
    catch(e){
        return false;
    }
}

module.exports.createCommands = function(){
    module.exports.commands["help"] = module.exports.helpCommand;
    module.exports.commands["addmessage"] = module.exports.addMessage;
    module.exports.commands["createmessage"] = module.exports.addMessage;
    module.exports.commands["deletemessage"] = module.exports.deleteMessage;
    module.exports.commands["removemessage"] = module.exports.deleteMessage;
    module.exports.commands["messages"] = module.exports.messages;
    module.exports.commands["prefix"] = module.exports.prefix;
}

function splitOnce(inp, delim){
    let arr = inp.split(delim);
    return [arr.shift(), arr.join(delim)];
}