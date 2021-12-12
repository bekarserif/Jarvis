const {GuildMember} = require('discord.js');

module.exports =
  async function skip(message, args, player) {
    try {
        if (!(message.member instanceof GuildMember) || !message.member.voice.channel) {
            return message.channel.send(
                "You need to be in a voice channel to play music!"
              );
        }
    
        if (
            message.guild.me.voice.channelId &&
            message.member.voice.channelId !== message.guild.me.voice.channelId
        )
        {
          return message.channel.send(
            "You are not in my voice channel!"
          );
        }
    
        const queue = player.getQueue(message.guildId);
        if (!queue || !queue.playing) return void message.channel.send(
            '❌ | No music is being played!'
          );
        const currentTrack = queue.current;
        const success = queue.skip();
        return void message.channel.send(
            success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!'
          );
    } catch (error) {
        console.log(error)
    }
    
  }
