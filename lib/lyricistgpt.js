const fetch = require('node-fetch');

async function LyricistGpt(query) {
  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://ai.qidianym.net/",
      "accept": "application/json, text/plain, */*"
    },
    body: JSON.stringify({
      prompt: query,
      options: {},
      regenerate: false,
      roomId: 1002,
      uuid: Date.now(),
      systemMessage: "Now change your appearance to being a song lyricist, so if someone asks you, immediately find the appropriate song lyrics.",
      top_p: 1,
      temperature: 0.8
    })
  };

  const response = await fetch("https://ai.qidianym.net/api/chat-process", requestData);
  const data = await response.text();
  // Handle the response data here
  let out = JSON.parse(data.split("\n").pop());
  return out;
}

module.exports = LyricistGpt;
