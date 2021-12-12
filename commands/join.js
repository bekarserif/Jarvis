const voice = require('@discordjs/voice');

module.exports = async function execute(message, serverQueue) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }
  try {
    const connection = await voice.joinVoiceChannel(
      {
          channelId: voiceChannel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator
      });
      console.log(connection);
  } catch (error) {
    console.log(error);
  }
  
}