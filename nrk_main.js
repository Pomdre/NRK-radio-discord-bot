//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Invite https://discordapp.com/oauth2/authorize?client_id=638025532688171027&permissions=66186560&scope=bot          //
//  Laget av @Pomdre                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Discord = require('discord.js');
const client = new Discord.Client();
const args = require('yargs').argv;

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Serving ${client.guilds.cache.size} servers`);
  });
  
  client.once("reconnecting", () => {
    console.log("Reconnecting!");
  });
  
  client.once("disconnect", () => {
    console.log("Disconnect!");
  });

client.on('message', msg => {
  if (msg.author.bot) return;
  // Command can only be used in a server
  if (!msg.guild) return msg.reply('Du kan bare sende meg kommandoer fra server jeg er med i :D');

  // Set required variables
  const prefix = '!nrk lytt',
      args = msg.content.slice(prefix.length).split(' '),
      cmd = args.shift().toLowerCase(),
      radioChannel = (args.shift() || '').toLowerCase(),
      voiceChannel = msg.member.voice.channel,
      radioServers = {
          'p1': 'http://lyd.nrk.no/nrk_radio_p1_hordaland_aac_h',
          'p2': 'http://lyd.nrk.no/nrk_radio_p2_mp3_m',
          'p3': 'http://lyd.nrk.no/nrk_radio_p3_mp3_m',
          'mp3': 'http://lyd.nrk.no/nrk_radio_mp3_mp3_m'
      };
      const streamOptions = { filter : 'audioonly', bitrate : 'auto', highWaterMark : 12  };

  // Stop if prefix isn't used
  if (!msg.content.startsWith(prefix)) return;

  // Require the user to be in a vioce channel
  if (!voiceChannel) return msg.reply('Du må være i en talekanal først!');

  // Require a valid radio server
  if (typeof radioServers[radioChannel] !== 'string') return msg.reply(`${radioChannel} er ikke en gyldig tjener!`);

  // Join the voice channel
   voiceChannel.join()
  .then(connection => {
      const dispatcher = connection.play(radioServers[radioChannel], streamOptions);
      msg.reply(`Spiller nå: NRK ${radioChannel}`);

      client.on('message', msg => {
        if (msg.author.bot) return;
          // Set required variables
          const prefix = '!nrk ',
              args1 = msg.content.slice(prefix.length).split(' '),
              cmd1 = args1.shift().toLowerCase();
          
          let method;
          switch (cmd1) {
              case 'stop': method = 'destroy', msg.reply(`Stoppet: NRK ${radioChannel}`);
              case 'pause': return dispatcher.pause(true), msg.reply(`Pauset: NRK ${radioChannel}`);
              case 'fortsett': return dispatcher.resume(), msg.reply(`Fortsetter å spille: NRK ${radioChannel}`);
              case 'forlat': return voiceChannel.leave();
              default: return;
          }
          dispatcher[method];
      });
      connection.on("error", error => console.error(error));
      dispatcher.on('error', console.error);
  });
});

//Help

const hjelp = {
  "embed": {
  "title": "NRK Radio Hjelp",
  "description": "**Kommandoer for boten og annen info**",
  "color": 16777215,
  "footer": {
    "text": `Laget av @Pomdre#0449 | Er med i ${client.guilds.cache.size} server(e)!`
  },
  "fields": [
    {
      "name": "Velg en kanal:",
      "value": "```!nrk lytt <kanal>```"
    },
    {
      "name": "Stopp radioen med:",
      "value": "```!nrk lytt <kanal>```",
      "inline": true
    },
    {
      "name": "Pause radioen med:",
      "value": "```!nrk pause```",
      "inline": true
    },
    {
      "name": "Fortsett radioen etter den er pauset:",
      "value": "```!nrk fortsett```",
      "inline": true
    },
    {
      "name": "Kast radioen ut av vinduet:",
      "value": "```!nrk forlat```",
      "inline": true
    },
    {
      "name": "Inviter meg:",
      "value": "https://discordapp.com/oauth2/authorize?client_id=638025532688171027&permissions=66186560&scope=bot"
    },
    {
      "name": "Kildekoden min:",
      "value": "https://github.com/Pomdre/NRK-radio-discord-bot"
    }
  ]
 }
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!nrk' + ' hjelp') {
  msg.reply(hjelp);
  }
});

client.login(args.token);
