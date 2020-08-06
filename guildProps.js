// {guildId: {prefix, jobs: {id: {lastId, channelId, data}}}
//data is json from https://discohook.org
module.exports.guildList = {};

module.exports.addGuild = function(guildId, data){
    if(!data.hasOwnProperty("prefix") || !data.hasOwnProperty("jobs")) return module.exports.addNewGuild(guildId);
    module.exports.guildList[guildId] = data;
}

module.exports.addNewGuild = function(guildId){
    module.exports.guildList[guildId] = {"prefix": ".", "jobs": {}};
    module.exports.saveGuild(guildId);
}

module.exports.saveGuild = async function(guildId){

}

module.exports.runJob = async function(guild, jobData, jobId){
    if(!jobData.hasOwnProperty("lastId") || !jobData.hasOwnProperty("channelId") || !jobData.hasOwnProperty("data")){
        return module.exports.removeJob(guild.id, jobId);
    }

    let channel = guild.channels.cache.get(jobData["channelId"]);
    if(!channel) return module.exports.removeJob(guild.id, jobId);

    if(jobData["lastId"] != null) {
        let message = channel.messages.cache.get(jobData["lastId"]);
        if (!message) return module.exports.removeJob(guild.id, jobId);
        message.delete();
    }

    module.exports.guildList[guild.id]["jobs"][jobId]["lastId"] = (await module.exports.sendMessage(channel, jobData["data"], jobId)).id;
}

module.exports.removeJob = function(guildId, jobId){
    if(!module.exports.guildList.hasOwnProperty(guildId)) module.exports.addNewGuild(guildId);
    if(!module.exports.guildList[guildId]["jobs"].hasOwnProperty(jobId)) return;
    delete module.exports.guildList[guildId]["jobs"][jobId];
}

module.exports.sendMessage = function(channel, data, jobId){
    let content = null;
    let embed = null;
    if(data.hasOwnProperty("content")){
        console.log("h");
        content = data["content"];
    }
    if(data.hasOwnProperty("embeds") && data["embeds"].length == 1) {
        embed = data["embeds"][0];
    }
    if(content == null && embed == null) return channel.send("Content and embed is blank. Id: "+jobId);
    if(content == null) return channel.send({"embed": embed});
    else if(embed == null) return channel.send(content)
    else return channel.send(content, {"embed": embed});
}

module.exports.testJob = function(guild, channel){
    if(!module.exports.guildList.hasOwnProperty(guild.id)) module.exports.addNewGuild(guild.id);

    let jobs = module.exports.guildList[guild.id]["jobs"];
    Object.keys(jobs).forEach(key => {
        if(jobs[key]["channelId"] === channel.id){
            module.exports.runJob(guild, jobs[key], key);
        }
    });
}