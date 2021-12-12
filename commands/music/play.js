//Util
const { GuildMember } = require('discord.js')
const { QueryType } = require('discord-player');
const youtubeAPIHelper = require('../../util/youtubeAPIHelper');
const ytdl = require("ytdl-core");
const fs = require('fs')

module.exports = async function (message, args, player) {
  try {
    const voiceChannel = message.member.voice.channel;
  if (!(message.member instanceof GuildMember)) {
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  }
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }
  // const songInfo = await youtubeAPIHelper(args[0]);
  let query = '';
  args.forEach(word => {
    query = word + ' ';
  });
  const searchResult = await player
        .search(query, {
          requestedBy: message.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});
  if (!searchResult || !searchResult.tracks.length)
    return message.channel.send("No results were found!");

  const queue = await player.createQueue(message.guild, {
      ytdlOptions: {
      quality: "highest",
      filter: "audioonly",
      highWaterMark: 1 << 25,
      dlChunkSize: 0,
    },
      metadata: message.channel,
    });

    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch(error) {
      console.log(error);
      void player.deleteQueue(message.guildId);
      return message.channel.send("Could not join your voice channel!");
    }

    await message.channel.send(`⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`); 
    searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
    if (!queue.playing) await queue.play();
  } catch (error) {
      console.log(error);
      return message.channel.send("There was an error trying to execute that command:"  + error.message);
  }
  
  // const url = `https://www.youtube.com/watch?v=${songInfo.id.videoId}`;
  // const song = {
  //   title: songInfo.snippet.title,
  //   url
  // };
  // if (!serverQueue) {
  //   const queueContruct = {
  //     textChannel: message.channel,
  //     voiceChannel: voiceChannel,
  //     connection: null,
  //     songs: [],
  //     volume: 5,
  //     playing: true,
  //   };
  //   // Setting the queue using our contract
  //   queue.set(message.guild.id, queueContruct);
  //   // Pushing the song to our songs array
  //   queueContruct.songs.push(song);

  //   try {
  //     // Here we try to join the voicechat and save our connection into our object.
  //     const connection = await voice.joinVoiceChannel(
  //       {
  //         channelId: message.member.voice.channel.id,
  //         guildId: message.guild.id,
  //         adapterCreator: message.guild.voiceAdapterCreator
  //       });
  //     queueContruct.connection = connection;
  //     // Calling the play function to start a song
  //     play(message.guild, queueContruct.songs[0], queue);
  //   } catch (err) {
  //     // Printing the error message if the bot fails to join the voicechat
  //     console.log(err);
  //     queue.delete(message.guild.id);
  //     return message.channel.send(err);
  //   }
  // } else {
  //   serverQueue.songs.push(song);
  //   console.log(serverQueue.songs);
  //   return message.channel.send(`${song.title} has been added to the queue!`);
  // }
}


async function play(guild, song, queue) {
  try {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    const file =await ytdl(song.url).pipe(fs.createWriteStream('video.mp4'));
    const dispatcher =await serverQueue.connection
      .playOpusPacket(file);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  } catch (err) {
    console.log(err)
  }

}