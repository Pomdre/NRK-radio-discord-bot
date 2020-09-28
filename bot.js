//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Inevneter meg https://discordapp.com/oauth2/authorize?client_id=638025532688171027&permissions=66186560&scope=bot   //
//  Laget av Sondre Batalden @Pomdre                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var prefix = "!nrk";

client.on('message', msg => {
  if (msg.content === prefix + ' ping') {
    msg.reply('pong');
  }
});

const streamOptions = { filter : 'audioonly', volume : 0.5, bitrate : 'auto', passes  : 1  };


client.on('message', msg => {

  if (!msg.guild) return;

  if (msg.content === prefix + ' p1') {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join()
        .then(connection => {

          msg.reply('Spiller nå: NRK p1');
          const dispatcher = connection.playArbitraryInput('http://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_mp3_m', streamOptions);

        client.on('message', msg => {
          if (msg.content === prefix + ' stop') {
            dispatcher.end()
          }
          if (msg.content === prefix + ' pause') {
            dispatcher.pause()
          }
          if (msg.content === prefix + ' fortsett') {
            dispatcher.resume()
          }
          if (msg.content === prefix + ' forlat') {
            msg.member.voiceChannel.leave();
          }
        });

        })
        .catch(console.log);
    } else {
      msg.reply('Du må være i en talekanal først!');
    }
  }



  if (msg.content === prefix + ' p2') {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join()
        .then(connection => {

          msg.reply('Spiller nå: NRK p2');
          const dispatcher = connection.playArbitraryInput('http://lyd.nrk.no/nrk_radio_p2_mp3_m', streamOptions);

        client.on('message', msg => {
          if (msg.content === prefix + ' stop') {
            dispatcher.end()
          }
          if (msg.content === prefix + ' pause') {
            dispatcher.pause()
          }
          if (msg.content === prefix + ' fortsett') {
            dispatcher.resume()
          }
          if (msg.content === prefix + ' forlat') {
            msg.member.voiceChannel.leave();
          }
        });

        })
        .catch(console.log);
    } else {
      msg.reply('Du må være i en talekanal først!');
    }
  }

});



client.login(settings.token);
