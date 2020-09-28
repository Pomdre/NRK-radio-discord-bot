//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Invite https://discordapp.com/oauth2/authorize?client_id=638025532688171027&permissions=66186560&scope=bot          //
//  Laget av @Pomdre                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

client.on('message', msg => {
  if (msg.author.bot) return;
  // Command can only be used in a server
  if (!msg.guild) return;

  // Set required variables
  const prefix = '!nrk lytt',
      args = msg.content.slice(prefix.length).split(' '),
      cmd = args.shift().toLowerCase(),
      radioChannel = (args.shift() || '').toLowerCase(),
      voiceChannel = msg.member.voice.channel,
      radioServers = {
          'p1': 'http://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_mp3_m',
          'p2': 'http://lyd.nrk.no/nrk_radio_p2_mp3_m',
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
              case 'stop': method = 'destroy';
              case 'pause': method = 'pause';
              case 'fortsett': method = 'resume';
              case 'forlat': return voiceChannel.leave();
              default: return;
          }
          dispatcher[method];

          // Based on the method, reply with a message?
      });
  });
});

client.login(settings.token);
