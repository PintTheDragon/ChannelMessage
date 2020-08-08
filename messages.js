module.exports.props = null;

module.exports.runJob = async function(channel, jobData, jobId){
    if(!jobData.hasOwnProperty("lastId") || !jobData.hasOwnProperty("channelId") || !jobData.hasOwnProperty("data")){
        return module.exports.removeJob(channel.guild.id, jobId);
    }

    try {
        let channel = channel.guild.channels.cache.get(jobData["channelId"]);
        if (!channel) return module.exports.removeJob(channel.guild.id, jobId);
    }
    catch(e){
        return module.exports.removeJob(channel.guild.id, jobId);
    }

    if(jobData["lastId"] != null) {
        try {
            let message = await channel.messages.fetch(jobData["lastId"]);
            if (message) message.delete();
        }
        catch(e){}
    }

    module.exports.props.guildList[channel.guild.id]["jobs"][jobId]["lastId"] = (await module.exports.sendMessage(channel, jobData["data"], jobId)).id;
    module.exports.props.saveGuild(channel.guild.id);
}

module.exports.removeJob = function(guildId, jobId){
    if(!module.exports.props.guildList.hasOwnProperty(guildId)) module.exports.props.addNewGuild(guildId);
    if(!module.exports.props.guildList[guildId]["jobs"].hasOwnProperty(jobId)) return;
    delete module.exports.props.guildList[guildId]["jobs"][jobId];
}

module.exports.sendMessage = function(channel, data, jobId){
    let content = null;
    let embed = null;
    if(data.hasOwnProperty("content")){
        content = data["content"];
    }
    if(data.hasOwnProperty("embeds") && data["embeds"].length === 1) {
        embed = data["embeds"][0];
        embed["footer"] = {text: "Id: "+jobId};
    }
    if(content == null && embed == null) return channel.send("Content and embed is blank. Id: "+jobId);
    if(content == null) return channel.send({"embed": embed});
    else if(embed == null) return channel.send(content)
    else return channel.send(content, {"embed": embed});
}

module.exports.testJob = function(channel){
    if(!module.exports.props.guildList.hasOwnProperty(channel.guild.id)) module.exports.props.addNewGuild(channel.guild.id);

    let jobs = module.exports.props.guildList[channel.guild.id]["jobs"];
    Object.keys(jobs).forEach(key => {
        if(jobs[key]["channelId"] === channel.id){
            module.exports.runJob(channel, jobs[key], key);
        }
    });
}

module.exports.deleteJob = function(channel){
    if(!module.exports.props.guildList.hasOwnProperty(channel.guild.id)) module.exports.props.addNewGuild(channel.guild.id);

    let jobs = module.exports.props.guildList[channel.guild.id]["jobs"];
    Object.keys(jobs).forEach(key => {
        if(jobs[key]["channelId"] === channel.id){
            module.exports.removeJob(channel.guild.id, key);
        }
    });
}