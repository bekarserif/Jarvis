const axios = require('axios');
require('dotenv').config(); //initialize dotenv
const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.GoogleAPIKey}&type=video&part=snippet&maxResults=10&q=`
module.exports = async function (msg, tokens)
{
    axios.get(url).then(response => {
        for (var i in response.data.items) {
            const item = response.data.items[i];
            console.log(`${item.id.videoId}  Title: ${item.snippet.title}`);
        }

    })
}