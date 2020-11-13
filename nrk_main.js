//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Invite https://discordapp.com/oauth2/authorize?client_id=638025532688171027&permissions=66186560&scope=bot          //
//  Laget av @Pomdre                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Discord = require('discord.js');
const client = new Discord.Client();
const args = require('yargs').argv;

let currentStatus = null;
let commands = ['!nrk <kanal>', '!nrk forlat', '!nrk hjelp']

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Serving ${client.guilds.cache.size} servers`);
    setInterval(() => {
      if (currentStatus === null || ++currentStatus === commands.length) {
        currentStatus = 0;
      }
      client.user.setActivity(commands[currentStatus]); //Set activity
    }, 15e3);
  });
  
  client.once("reconnecting", () => {
    console.log("Reconnecting!");
  });
  
  client.once("disconnect", () => {
    console.log("Disconnect!");
  });

client.on('message', msg => {
  // Command can only be used in a server
  if (!msg.guild) return msg.reply('Du kan bare sende meg kommandoer fra servere jeg er med i :D');
  if (msg.author.bot) return;

  // Set required variables
  const prefix = '!nrk lytt',
      args = msg.content.slice(prefix.length).split(' '),
      cmd = args.shift().toLowerCase(),
      radioChannel = (args.shift() || '').toLowerCase(),
      voiceChannel = msg.member.voice.channel,
      radioServers = {
          'p1': 'http://lyd.nrk.no/nrk_radio_p1_hordaland_aac_h',
          'p1+': 'http://lyd.nrk.no/nrk_radio_p1pluss_aac_h',
          'p1pluss': 'http://lyd.nrk.no/nrk_radio_p1pluss_aac_h',
          'p2': 'http://lyd.nrk.no/nrk_radio_p2_aac_h',
          'p3': 'http://lyd.nrk.no/nrk_radio_p3_aac_h',
          'p13': 'http://lyd.nrk.no/nrk_radio_p13_aac_h',
          'mp3': 'http://lyd.nrk.no/nrk_radio_mp3_aac_h',
          'alltid nyheter': 'http://lyd.nrk.no/nrk_radio_alltid_nyheter_aac_h',
          'super': 'http://lyd.nrk.no/nrk_radio_super_aac_h',
          'klassisk': 'http://lyd.nrk.no/nrk_radio_klassisk_aac_h',
          'sami': 'http://lyd.nrk.no/nrk_radio_sami_aac_h',
          'jazz': 'http://lyd.nrk.no/nrk_radio_jazz_aac_h',
          'folkemusikk': 'http://lyd.nrk.no/nrk_radio_folkemusikk_aac_h',
          'sport': 'http://lyd.nrk.no/nrk_radio_sport_aac_h',
          'urort': 'http://lyd.nrk.no/nrk_radio_urort_aac_h',
          'urørt': 'http://lyd.nrk.no/nrk_radio_urort_aac_h',
          'radioresepsjonen': 'http://lyd.nrk.no/nrk_radio_p3_radioresepsjonen_aac_h',
          'p3x': 'http://lyd.nrk.no/nrk_radio_p3x_aac_h'
      };
      const streamOptions = { filter : 'audioonly', bitrate : 'auto', highWaterMark : 12  };
      const kanalnavn = Object.keys(radioServers);

      if (msg.content.toLowerCase() === '!nrk kanaler') {
        msg.reply('**Kanaler**\n !nrk lytt ' + kanalnavn.toString());
      }

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
        var guild = msg.guild;
          // Set required variables
          const prefix = '!nrk ',
              args1 = msg.content.slice(prefix.length).split(' '),
              cmd1 = args1.shift().toLowerCase();
          
          let method;
          switch (cmd1) {
              case 'forlat': return guild.voice.channel.leave();
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
      "value": "```!nrk <kanal>```"
    },
    {
      "name": "Liste over kanaler:",
      "value": "```!nrk kanaler```",
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
  if (msg.content.toLowerCase() === '!nrk hjelp') {
  msg.reply(hjelp);
  }
});

client.login(args.token);
