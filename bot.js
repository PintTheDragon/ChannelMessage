const Discord = require("discord.js");
const client = new Discord.Client();

const props = require("./guildProps.js");
props.index = this;
props.setupMysql();
const commands = require("./commands.js");
commands.Discord = Discord;
commands.props = props;
commands.createCommands();

let id = "";

client.on('ready', () => {
    console.log("Bot started!");
    id = client.user.id;
    commands.idMsg = "<@!"+id+">";
    commands.idMsg1 = "<@"+id+">";

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
    if(!props.guildList.hasOwnProperty(guild.id)) props.addNewGuild(guild.id);
    let channels = guild.channels.cache.filter(channel => channel.type === "text" && (channel.name === "general" || channel.name === "welcome"));
    if(channels.size < 1){
        channels = guild.channels.cache.sort(function(chan1,chan2){
            if(chan1.type !== `text`) return 1;
            if(!chan1.permissionsFor(guild.me).has(`SEND_MESSAGES`)) return -1;
            return chan1.position < chan2.position ? -1 : 1;
        });
        if(channels.size < 1) return;
    }
    channels.first().send("Hi, thanks for inviting me! By default, my prefix is `.`, but you can also ping me instead (ex. `<@"+id+"> help`). The `.help` command will tell you about all of my commands, and how to use them. If you want to change my prefix, use the `.prefix <prefix>` command. I hope you enjoy!");
});

client.on('message', async msg => {
    if(msg.author.bot) return;

    if(!props.guildList.hasOwnProperty(msg.guild.id)) props.addNewGuild(msg.guild.id);

    if(!commands.runCommand(msg)) return props.testJob(msg.guild, msg.channel);
});

client.login(process.env.TOKEN);