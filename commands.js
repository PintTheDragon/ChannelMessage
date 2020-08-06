module.exports.Discord = null;
module.exports.props = null;

module.exports.helpCommand = function(channel){
    let prefix = module.exports.props.guildList[channel.guild.id]["prefix"];
    channel.send({embed: new module.exports.Discord.MessageEmbed()
        .setColor("#0c9ba8")
        .setTitle("Commands")
        .setDescription("Here are all the commands in this bot.")
        .addField(prefix+"help", "Gives a list of every command.", true)
        .addField(prefix+"addMessage <message data>", "Adds a message (get message data from https://discohook.org/?message=eyJtZXNzYWdlIjp7ImVtYmVkcyI6W3t9XX19).", true)
        .addField(prefix+"deleteMessage <id>", "Removes a message.", true)
        .addField(prefix+"messages", "Gives a list of every message.", true)
        .addField(prefix+"prefix <prefix>", "Sets the prefix.", true)
    });
}

module.exports.addMessage = function(channel, guild, content){
    try {
        module.exports.props.guildList[guild.id]["jobs"][Math.max(Object.keys(module.exports.props.guildList[guild.id]["jobs"]))+1] = {lastId: null, channelId: channel.id, data: JSON.parse(content.replace("\n", ""))};
    }
    catch(e){
        channel.send("Invalid data");
    };
}

module.exports.deleteMessage = function(guild, content){

}

module.exports.messages = function(channel){

}

module.exports.prefix = function(guild, content){

}