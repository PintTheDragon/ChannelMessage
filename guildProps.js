const mysql = require('mysql');

let con;

// {guildId: {prefix, jobs: {id: {lastId, channelId, data}}}
//data is json from https://discohook.org
module.exports.guildList = {};

module.exports.defaultConfig = {"prefix": ".", "jobs": {}};

module.exports.setupMysql = function(callback){
    con = mysql.createPool({
        host: process.env.HOST,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
    con.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query("SELECT * FROM "+process.env.TABLE+";", async (err, result) =>{
            if(err) throw err;

            for(let i = 0; i < result.length; i++){
                try {
                    module.exports.addGuild(result[i]["id"].replace(/^'/, "").replace(/'$/, ""), JSON.parse(Buffer.from(result[i]["data"].replace(/^'/, "").replace(/'$/, ""), 'base64').toString('utf8')));
                }
                catch(e){
                    module.exports.addNewGuild(result[i]["id"].replace(/^'/, "").replace(/'$/, ""));
                }
            }
            callback();
        });
    });
}

module.exports.addGuild = function(guildId, data){
    module.exports.guildList[guildId] = data;

    let save = false;

    Object.keys(module.exports.defaultConfig).forEach((key) => {
       if(!data.hasOwnProperty(key)){
           data[key] = module.exports.defaultConfig[key];
           save = true;
       }
    });

    if(save) module.exports.saveGuild(guildId);
}

module.exports.addNewGuild = function(guildId){
    module.exports.guildList[guildId] = module.exports.defaultConfig;
    module.exports.saveGuild(guildId);
}

module.exports.saveGuild = async function(guildId){
    let data = Buffer.from(JSON.stringify(module.exports.guildList[guildId])).toString('base64');
    con.getConnection((err, connection) => {
        if(err) return;
        connection.query('INSERT INTO '+process.env.TABLE+' (id, data) VALUES(?, ?) ON DUPLICATE KEY UPDATE data="?";', [guildId, data, data]);
    });
}