const axios = require('axios');
require('dotenv').config(); //initialize dotenv

module.exports = async function (args)
{
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${args}&key=${process.env.GoogleAPIKey}`
    const response =await axios.get(url);
    return response.data.items[0];    
}

