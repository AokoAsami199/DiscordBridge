const config = {
    webhookUrl: "link webhook",
    defaultEmbedHex: "15418782", //https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812 vao day lay mau
    server_icon: "icon cua server ko them cung duoc",
}

const storage = {
    lastMessageId: 0
};

mc.listen('onChat', function (player, message) {
    sendWebhook(createDefaultEmbed(player.name, message));
});

mc.listen('onJoin', function (player) {
    sendWebhook({
        "description": `Người chơi ${player.name} đã vào server`,
        "color": config.defaultEmbedHex,
        "author": {
            "name": "Server Name | Join",
            "icon_url": config.server_icon
        },
    });
});


mc.listen('onLeft', function (player) {
    sendWebhook({
        "description": `Người chơi ${player.name} đã thoát server`,
        "color": config.defaultEmbedHex,
        "author": {
            "name": "Server Name | Left",
            "icon_url": config.server_icon
        },
    });
});


function sendWebhook(embed) {
    network.httpPost(config.webhookUrl, JSON.stringify({
        "embeds": [
            embed
        ]
    }), "application/json", function (status, result) {})
}

function createDefaultEmbed(author, description) {
    return {
        "description": description,
        "color": config.defaultEmbedHex,
        "footer": {
            "icon_url": "https://minecraftfaces.com/wp-content/bigfaces/big-steve-face.png",
            "text": author
        },
        "author": {
            "name": "Server Name | Chat logger",
            "icon_url": config.server_icon
        },
    };
}

setInterval(() => {
    network.httpGet(`http://127.0.0.1:3000/getLatestMessage`,
    function (status, result) {
        if(status !== 200){
            return;
        }
        result = data.parseJson(result);
        if(storage.lastMessageId === result.messageId){
            return;
        }
        storage.lastMessageId = result.messageId;
        mc.broadcast(`${result.messageAuthor} > ${result.messageContent}`);
    });
}, 1000 * 2);