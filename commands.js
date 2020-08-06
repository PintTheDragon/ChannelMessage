module.exports.Discord = null;
module.exports.props = null;

module.exports.helpCommand = function(channel){
    let prefix = module.exports.props.guildList[channel.guild.id]["prefix"];
    channel.send({embed: new module.exports.Discord.MessageEmbed()
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

module.exports.addMessage = function(channel, guild, content){
    try {
        module.exports.props.guildList[guild.id]["jobs"][Math.max(...Object.keys(module.exports.props.guildList[guild.id]["jobs"]))+1] = {lastId: null, channelId: channel.id, data: JSON.parse(content.replace("\n", ""))};
        module.exports.props.saveGuild(guild.id);
        module.exports.props.testJob(guild, channel);
        return true;
    }
    catch(e){
        channel.send("Invalid data!");
    };
}

module.exports.deleteMessage = async function(channel, guild, content){
    try {
        if(isNaN(content)) channel.send("Invalid id!");
        if(!module.exports.props.guildList[guild.id]["jobs"].hasOwnProperty(content)) channel.send("Invalid id!");
        let message = module.exports.props.guildList[guild.id]["jobs"][content]["lastId"];
        if(message != null) {
            let message = await channel.messages.fetch(message);
            if (message) message.delete();
        }
        delete module.exports.props.guildList[guild.id]["jobs"][content];
        module.exports.props.saveGuild(guild.id);
        return true;
    }
    catch(e){
        channel.send("Invalid id!");
    }
}

module.exports.messages = function(channel){
    let embed = new module.exports.Discord.MessageEmbed()
        .setColor("#0c9ba8")
        .setTitle("Messages")
        .setDescription("List of messages.");
    let jobs = module.exports.props.guildList[channel.guild.id]["jobs"];
    Object.keys(jobs).forEach(key => {
       embed.addField("Id: "+key, "Channel: <#"+jobs[key]["channelId"]+">", true);
    });
    channel.send({embed: embed});
}

module.exports.prefix = function(guild, content){
    module.exports.props.guildList[guild.id]["prefix"] = content;
    module.exports.props.saveGuild(guild.id);
    return true;
}