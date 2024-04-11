const cheerio = require('cheerio')
const fetch = require('node-fetch')
const conpiq = require('../config.js')

async function Search(query) {
  const url = `${conpiq.baseUrl.dlandroid}?s=${encodeURIComponent(query)}`; // Ganti dengan URL pencarian yang sesuai
  const proxyurl = "https://corsproxy.io/?";
  try {
    const response = await fetch(proxyurl + url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const posts = $('div.post').map((index, element) => {
      const postElement = $(element);
      return {
        title: postElement.find('a.onvan > h2').eq(0).text().trim(),
        description: postElement.find('div.matn-post > p').text(),
        date: postElement.find('span.info').eq(0).text().trim(),
        categories: postElement.find('span.info').eq(1).find('a').map((index, el) => $(el).text()).get(),
        downloadLink: postElement.find('a.more').attr('href')
      };
    }).get();

    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function Down(url) {
const proxyurl = "https://corsproxy.io/?";
  try {
    const response = await fetch(proxyurl + url.endsWith('/download') ? proxyurl + url : proxyurl + url + '/download');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    return {
      rating: $('span.rateshow').text(),
      title: $('a.img-n').attr('title'),
      ogImageUrl: $('meta[property="og:image"]').attr('content'),
      downloadLink: $('div.bilorda a#dllink').attr('href'),
      requiresAndroid: $('ul.infodl li:nth-child(1)').text().trim().split(':')[1].trim(),
      fileSize: $('ul.infodl li:nth-child(2)').text().trim().split(':')[1].trim(),
      help: $('div.help a').map((index, element) => ({
        buttonText: $(element).find('button').text(),
        link: $(element).attr('href')
      })).get()
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { Search, Down };
