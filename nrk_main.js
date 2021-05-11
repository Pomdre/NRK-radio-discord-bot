//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Invite https://discordapp.com/oauth2/authorize?client_id=638025532688171027&permissions=66186560&scope=bot          //
//  Laget av @Pomdre                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Discord = require('discord.js');
const client = new Discord.Client();
const http = require("http");
const args = require('yargs').argv;

let currentStatus = null;
let commands = ['!nrk lytt <kanal>', '!nrk forlat', '!nrk hjelp']

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Serving ${client.guilds.cache.size} servers`);
    setInterval(() => {
      if (currentStatus === null || ++currentStatus === commands.length) {
        currentStatus = 0;
      }
      client.user.setActivity(commands[currentStatus]); // Set activity
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
  if (!msg.guild) return msg.author.send('Du kan bare sende meg kommandoer fra servere jeg er med i :D').catch(console.error);
  if (msg.author.bot) return;

  // Set required variables
  const prefix = '!nrk lytt',
      args = msg.content.slice(prefix.length).split(' '),
      cmd = args.shift().toLowerCase(),
      radioChannel = (args.shift() || '').toLowerCase(),
      voiceChannel = msg.member.voice.channel,
      domain = 'http://lyd.nrk.no',
      radioServers = {
          'p1': '/nrk_radio_p1_hordaland_aac_h',
          'p1+': '/nrk_radio_p1pluss_aac_h',
          'p1pluss': '/nrk_radio_p1pluss_aac_h',
          'p2': '/nrk_radio_p2_aac_h',
          'p3': '/nrk_radio_p3_aac_h',
          'p13': '/nrk_radio_p13_aac_h',
          'mp3': '/nrk_radio_mp3_aac_h',
          'alltid nyheter': '/nrk_radio_alltid_nyheter_aac_h',
          'super': '/nrk_radio_super_aac_h',
          'klassisk': '/nrk_radio_klassisk_aac_h',
          'sami': '/nrk_radio_sami_aac_h',
          'jazz': '/nrk_radio_jazz_aac_h',
          'folkemusikk': '/nrk_radio_folkemusikk_aac_h',
          'sport': '/nrk_radio_sport_aac_h',
          'urort': '/nrk_radio_urort_aac_h',
          'urørt': '/nrk_radio_urort_aac_h',
          'radioresepsjonen': '/nrk_radio_p3_radioresepsjonen_aac_h',
          'p3x': '/nrk_radio_p3x_aac_h'
      };
      const streamOptions = { filter : 'audioonly', bitrate : 'auto', highWaterMark : 12  };
      const kanalnavn = Object.keys(radioServers);

      if (msg.content.toLowerCase() === '!nrk kanaler') {
        const kanaler = new Discord.MessageEmbed()
        .setColor(255, 255, 255)
        .setAuthor('NRK Radio', 'https://imal.no/wp-content/uploads/2016/02/nrk-radio.png')
        .setTitle('Kanaler:')
        for (const [key, value] of Object.entries(radioServers)) {
          kanaler.addFields(
            { name: '!nrk lytt ', value: key, inline: true},
          )
        }
        msg.reply(kanaler);
      }

  // Stop if prefix isn't used
  if (!msg.content.startsWith(prefix)) return;

  // Require the user to be in a vioce channel
  if (!voiceChannel) return msg.reply('Du må være i en talekanal først!');

  // Require a valid radio server
  if (typeof radioServers[radioChannel] !== 'string') return msg.reply(`${radioChannel} er ikke en gyldig tjener!`);

function info() {
  var options = {
    host: 'lyd.nrk.no',
    port: 80,
    path: radioServers[radioChannel] + '.xspf'
  };
  
  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);
  
    res.on("data", function(chunk) {
      var patt = /(?<=title>)(.*)(?=[<])/;
      var result = String(chunk).match(patt);

      const playing = new Discord.MessageEmbed()
      .setColor(255, 255, 255)
      .setAuthor('NRK Radio', 'https://imal.no/wp-content/uploads/2016/02/nrk-radio.png')
      .addFields(
        { name: 'Du hører på:', value: `NRK ${radioChannel}` },
        { name: 'Spiller nå:', value: result[0] },
      )
      msg.reply(playing);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    msg.reply('En feil oppstod!')
  });
}

  // Join the voice channel
  voiceChannel.join()
  .then(connection => {
      const dispatcher = connection.play(domain + radioServers[radioChannel], streamOptions);
      info();

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

// Help
client.on('message', msg => {
  if (msg.content.toLowerCase() === '!nrk hjelp') {
  const help = new Discord.MessageEmbed()
	.setColor('fafafa')
  .setAuthor('NRK Radio', 'https://imal.no/wp-content/uploads/2016/02/nrk-radio.png')
	.setTitle('Hjelp')
	.setDescription('**Kommandoer for boten og annen info**')
	.addFields(
		{ name: 'Velg en kanal:', value: '```!nrk lytt <kanal>```' },
		{ name: 'Liste over kanaler:', value: '```!nrk kanaler```', inline: true },
		{ name: 'Kast radioen ut av vinduet:', value: '```!nrk forlat```', inline: true },
    { name: 'Inviter meg:', value: 'https://discordapp.com/oauth2/authorize?client_id=638025532688171027&permissions=66186560&scope=bot' },
    { name: 'Kildekoden min:', value: 'https://github.com/Pomdre/NRK-radio-discord-bot' },
	)
	.setFooter(`Laget av @Pomdre#0449 | Er med i ${client.guilds.cache.size} server(e)!`);
  msg.reply(help)
  }
});

client.login(args.token);
