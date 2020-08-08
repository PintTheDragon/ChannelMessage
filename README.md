<p align="center">
<a href="https://github.com/PintTheDragon/ChannelMessage"><img src="https://i.imgur.com/YE0mYLs.png" width="300px"/></a>
</p>
<h1 align="center">ChannelMessage</h1>
<p align="center">
<a href="https://github.com/PintTheDragon/ChannelMessage"><img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/PintTheDragon/ChannelMessage"></a>
<a href="https://discord.js.org"><img alt="GitHub package.json dependency version (prod)" src="https://img.shields.io/github/package-json/dependency-version/PintTheDragon/ChannelMessage/discord.js"></a>
<a href="https://github.com/PintTheDragon/ChannelMessage"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/PintTheDragon/ChannelMessage/CI"></a>
<a href="https://github.com/PintTheDragon/ChannelMessage"><img alt="GitHub" src="https://img.shields.io/github/license/PintTheDragon/ChannelMessage"></a>
</p>

ChannelMessage is a bot that will put a message at the bottom of a channel. If any messages are sent, it will be moved below them. This can be used for anything from giving info on a channel to having more organized server info channels. Commands:

*   `.help` - Gives a list of every command.
*   `.addMessage <message data>` - Adds a message (get message data from [https://discohook.org](https://discohook.org/?message=eyJtZXNzYWdlIjp7ImVtYmVkcyI6W3t9XX19)). Run in the channel you want the message to appear in
*   `.deleteMessage <id>` - Removes a message.
*   `.messages` - Gives a list of every message.
*   `.prefix <prefix>` - Sets the prefix.

To create a message, go to [https://discohook.org](https://discohook.org/?message=eyJtZXNzYWdlIjp7ImVtYmVkcyI6W3t9XX19) and copy the JSON output in the bottom. Then, run `.addMessage <message data>` in the channel you want the message in, replacing "message data" with your copied json. That's it! You can view your messages with `.messages`, and delete with `.deleteMessage <id>`!
  
Getting the json data (the website is [https://discohook.org](https://discohook.org/?message=eyJtZXNzYWdlIjp7ImVtYmVkcyI6W3t9XX19)):  
![](https://i.imgur.com/N0Y5z1P.gif "source: imgur.com") 

Creating a message:  
![](https://i.imgur.com/VmFYUlc.gif "source: imgur.com")
