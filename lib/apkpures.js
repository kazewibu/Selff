const cheerio = require('cheerio')
const fetch = require('node-fetch')
const conpiq = require('../config.js')

async function Search(q) {
  const url = conpiq.baseUrl.apkpures + '/cn/search?q=' +q+ '&t=app'; // Ganti dengan URL sumber data Anda
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const searchData = [];
  $('ul.search-res li').each((index, element) => {
    const $element = $(element);
    
    const obj = {
      link: conpiq.baseUrl.apkpures + $element.find('a.dd').attr('href'),
      image: $element.find('img').attr('src'),
      name: $element.find('.p1').text().trim(),
      developer: $element.find('.p2').text().trim(),
      tags: $element.find('.tags .tag').map((i, el) => $(el).text().trim()).get(),
      downloadLink: conpiq.baseUrl.apkpures + $element.find('.right_button a.is-download').attr('href'),
      fileSize: $element.find('.right_button a.is-download').data('dt-filesize'),
      version: $element.find('.right_button a.is-download').data('dt-version'),
      versionCode: $element.find('.right_button a.is-download').data('dt-versioncode'),
    };
    searchData.push(obj);
  });

  return searchData;
}

async function Down(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const linkTag = $('link[rel="canonical"]').attr('href');
    const titleTag = $('meta[property="og:title"]').attr('content');
    const downloadURL = `https://d.apkpure.com/b/APK/${linkTag.split("/")[5]}?version=latest`;
    const data = {
      link: downloadURL,
      title: titleTag
    };

    return data;
  } catch (error) {
    console.log('Error:', error);
  }
}
module.exports = { Search, Down };