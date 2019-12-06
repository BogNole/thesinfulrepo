const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = '/';
const ytdl = require("ytdl-core");


var servers = {};

bot.on('ready', () => {
    console.log('Online and ready to jam !');
    bot.user.setActivity('With some Glocks <3');
})

bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'greet':
            message.reply('I answer thou call')
            break;


        case 'clear':
            if (!args[1]) return message.reply('Error! Specify amount of messages to delete! ')
            message.channel.bulkDelete(args[1]);
            break;



        case 'play':

            function play(connection, message) {
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: "audioonly" }));
                server.queue.shift();
                server.dispatcher.on("end", function () {
                    if (server.queue[0]) {
                        play(connection, message);
                        dispatcher.setVolume(0.5)
                    }
                    else {
                        connection.disconnect();

                    }
                })
            }


            if (!args[1]) {
                message.reply("You need to provide a link to the song!");
                return;
            }
            if (!message.member.voiceChannel) {
                message.reply("You must be in a voice channel dude!");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                play(connection, message);
            })
            break;


        case 'skip':
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping the song!");
            console.log('Skipped song milord');

            break;


        case 'stop':
            var server = servers[message.guild.id];
            if (message.guild.voiceConnection) {
                for (var i = server.queue.length - 1; i > 0; i--) {
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
                message.channel.send("Ending the queue and leaving this place Milord !");
                console.log('stopped the queue milord');
            }

            break;

        case 'kick':
            if (!args[1]) message.reply("Who do you wanna kick? (Mention them with @name)");


            const user = message.mentions.users.first();

            if (user) {
                const member = message.guild.member(user);

                if (member) {
                    member.kick("You've been kicked!").then(() => {
                        message.reply(`Successfully kicked ${user.tag}`);
                    }).catch(err => {
                        message.reply(`Member not kicked`);
                        console.log(err);
                    });
                } else {
                    message.reply("User isn\'t in the server")
                }
            }

            break;

        case 'ban':
            if (!args[1]) message.reply("Who do you wanna ban? (Mention them with @name)");

            const user2 = message.mentions.users.first();

            if (user2) {
                const member = message.guild.member(user);

                if (member) {
                    member.ban({ reason: 'You have been banned!' }).then(() => {
                        message.reply(`Successfully banned ${user2.tag}`);
                    }).catch(err => {
                        message.reply(`Member not banned`);
                        console.log(err);
                    });
                } else {
                    message.reply("User isn\'t in the server")
                }
            }

            break;

    }
})


bot.login(process.env.token);
