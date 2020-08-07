<p align="center">
<img src="https://i.imgur.com/YE0mYLs.png" width="300px"/>
</p>
<h1 align="center">ChannelMessage</h1>
<p align="center">
<a href="https://www.codefactor.io/repository/github/pintthedragon/channelmessage"><img src="https://www.codefactor.io/repository/github/pintthedragon/channelmessage/badge" alt="CodeFactor" /></a>
<a href="https://github.com/discordjs"><img src="https://camo.githubusercontent.com/a94d7d6e46d0a8f23d7e6aa118ae827cb905d760/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646973636f72642e6a732d7631322e302e302d2d6465762d626c75652e7376673f6c6f676f3d6e706d" alt="" data-canonical-src="https://img.shields.io/badge/discord.js-v12.0.0--dev-blue.svg?logo=npm" style="max-width:100%;"></a>
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
