const fastify = require('fastify')()
const axios = require('axios').default;

const botToken = "OTExMTUwOTM1NDcwOTE1NTg0.YZdNbw.r_l7qkpNG1JXxX4xtlhhhzNTTyQ";
const channelId = "839862143364104246";

const header = {
    headers: {
        'Authorization': `Bot ${botToken}`
    }
};

fastify.get('/getLatestMessage', async (request, reply) => {
    const channelResponse = await axios.get(`https://discord.com/api/channels/${channelId}`, header);
    if(channelResponse.status !== 200){
        console.log("Có vấn đề với discord.");
        return;
    }
    const lastMessageId = channelResponse.data.last_message_id;
    const messageResponse = await axios.get(`https://discord.com/api/channels/${channelId}/messages/${lastMessageId}`, header);
    if(messageResponse.status !== 200){
        console.log("Có vấn đề với discord.");
        return;
    }
    if(messageResponse.data.author.bot){
        return;
    }
    return {messageId: messageResponse.data.id, messageAuthor: messageResponse.data.author.username, messageContent: messageResponse.data.content};
})


// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()