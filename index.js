const tracer = require('dd-trace').init({
    analytics: true,
    profiling: true
})
require('dotenv').config();
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN });

manager.spawn();