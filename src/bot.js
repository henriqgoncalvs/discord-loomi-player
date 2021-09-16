const dotenv = require('dotenv');

const { Client, Intents } = require('discord.js');

const musicCommands = require("./commands/music");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

dotenv.config();

const PREFIX = "!";

const settings = {
    prefix: PREFIX,
    token: process.env.DISCORD_CLIENT_TOKEN
};

const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false, // This options are optional.
});
// You can define the Player as *client.player* to easly access it.
client.player = player;

// Init the event listener only once (at the top of your code).
client.player

  // Emitted when channel was empty.
  .on("channelEmpty", (queue) =>
    console.log(`Everyone left the Voice Channel, queue ended.`)
  )

  // Emitted when a song was added to the queue.
  .on("songAdd", (queue, song) =>
    console.log(`Song ${song} was added to the queue.`)
  )
  // Emitted when a playlist was added to the queue.
  .on("playlistAdd", (queue, playlist) =>
    console.log(
      `Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`
    )
  )

  // Emitted when there was no more music to play.
  .on("queueEnd", (queue) => console.log(`The queue has ended.`))

  // Emitted when a song changed.
  .on("songChanged", (queue, newSong, oldSong) =>
    console.log(`${newSong} is now playing.`)
  )

  // Emitted when a first song in the queue started playing.
  .on("songFirst", (queue, song) => console.log(`Started playing ${song}.`))

  // Emitted when someone disconnected the bot from the channel.
  .on("clientDisconnect", (queue) =>
    console.log(`I was kicked from the Voice Channel, queue ended.`)
  )

  // Emitted when deafenOnJoin is true and the bot was undeafened
  .on("clientUndeafen", (queue) => console.log(`I got undefeanded.`))

  // Emitted when there was an error in runtime
  .on("error", (error, queue) => {
    console.log(`Error: ${error}`);
    // console.log(`Error: ${error} in ${queue.guild.name}`);
  });

client.on("ready", () => {
    console.log("Hey astronaut, let's listen to some music 👩‍🚀🎶");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  let [command, ...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);

  // command = command.toLowerCase();

  console.log(command);
  console.log(args);

  musicCommands(client.player, message, command, args);
});

client.login(settings.token);
