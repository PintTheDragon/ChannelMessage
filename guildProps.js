const mysql = require('mysql');

let con;

module.exports.setupMysql = function(){
    con = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query("SELECT * FROM "+process.env.TABLE+";", async (err, result) =>{
            if(err) throw err;

            for(let i = 0; i < result.length; i++){
                try {
                    module.exports.addGuild(result[i]["id"].replace(/^'/, "").replace(/'$/, ""), JSON.parse(result[i]["data"].replace(/^'/, "").replace(/'$/, "")));
                }
                catch(e){
                    module.exports.addNewGuild(result[i]["id"].replace(/^'/, "").replace(/'$/, ""));
                }
            }
        });
    });
}

// {guildId: {prefix, jobs: {id: {lastId, channelId, data}}}
//data is json from https://discohook.org
module.exports.guildList = {};

module.exports.addGuild = function(guildId, data){
    if(!data.hasOwnProperty("prefix") || !data.hasOwnProperty("jobs")) return module.exports.addNewGuild(guildId);
    module.exports.guildList[guildId] = data;
    Object.keys(module.exports.guildList[guildId]["jobs"]).forEach(key => {
        module.exports.guildList[guildId]["jobs"][key]["data"] = JSON.parse(Buffer.from(module.exports.guildList[guildId]["jobs"][key]["data"], 'base64').toString('utf8'));
        if(typeof module.exports.guildList[guildId]["jobs"][key]["data"] === "string") {
            module.exports.guildList[guildId]["jobs"][key]["data"] = JSON.parse(module.exports.guildList[guildId]["jobs"][key]["data"]).replace(/(?:\\[rn])+/g, '');
        }
    });
    module.exports.guildList[guildId]["prefix"] = Buffer.from(module.exports.guildList[guildId]["prefix"], 'base64').toString('utf8');
}

module.exports.addNewGuild = function(guildId){
    module.exports.guildList[guildId] = {"prefix": ".", "jobs": {}};
    module.exports.saveGuild(guildId);
}

module.exports.saveGuild = async function(guildId){
    Object.keys(module.exports.guildList[guildId]["jobs"]).forEach(key => {
        module.exports.guildList[guildId]["jobs"][key]["data"] = Buffer.from(JSON.stringify(module.exports.guildList[guildId]["jobs"][key]["data"])).toString('base64');
    });
    module.exports.guildList[guildId]["prefix"] = Buffer.from(module.exports.guildList[guildId]["prefix"]).toString('base64');
    let json = JSON.stringify(module.exports.guildList[guildId]);
    con.query('INSERT INTO '+process.env.TABLE+' (id, data) VALUES(?, ?) ON DUPLICATE KEY UPDATE data="?";', [guildId, json, json]);
    Object.keys(module.exports.guildList[guildId]["jobs"]).forEach(key => {
        module.exports.guildList[guildId]["jobs"][key]["data"] = JSON.parse(Buffer.from(module.exports.guildList[guildId]["jobs"][key]["data"], 'base64').toString('utf8'));
        if(typeof module.exports.guildList[guildId]["jobs"][key]["data"] === "string") {
            module.exports.guildList[guildId]["jobs"][key]["data"] = JSON.parse(module.exports.guildList[guildId]["jobs"][key]["data"]).replace(/(?:\\[rn])+/g, '');
        }
    });
    module.exports.guildList[guildId]["prefix"] = Buffer.from(module.exports.guildList[guildId]["prefix"], 'base64').toString('utf8');
}

module.exports.runJob = async function(channel, guild, jobData, jobId){
    if(!jobData.hasOwnProperty("lastId") || !jobData.hasOwnProperty("channelId") || !jobData.hasOwnProperty("data")){
        return module.exports.removeJob(guild.id, jobId);
    }

    try {
        let channel = guild.channels.cache.get(jobData["channelId"]);
        if (!channel) return module.exports.removeJob(guild.id, jobId);
    }
    catch(e){
        return module.exports.removeJob(guild.id, jobId);
    }

    if(jobData["lastId"] != null) {
        try {
            let message = await channel.messages.fetch(jobData["lastId"]);
            if (message) message.delete();
        }
        catch(e){}
    }

    module.exports.guildList[guild.id]["jobs"][jobId]["lastId"] = (await module.exports.sendMessage(channel, jobData["data"], jobId)).id;
    module.exports.saveGuild(guild.id);
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
        content = data["content"];
    }
    if(data.hasOwnProperty("embeds") && data["embeds"].length == 1) {
        embed = data["embeds"][0];
        embed["footer"] = {text: "Id: "+jobId};
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
            module.exports.runJob(channel, guild, jobs[key], key);
        }
    });
}