const fetch = require('node-fetch');
const cheerio = require('cheerio');
const conpiq = require('../config.js')

async function Search(query) {
  const proxyurl = 'https://files.xianqiao.wang/';
  const response = await fetch(proxyurl + `${conpig.baseUrl.apkgk}/search/?keyword=${query}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const items = [];

  $('li').each((index, element) => {
    const item = {
      href: conpig.baseUrl.apkgk + $('a', element).attr('href'),
      title: $('a', element).attr('title'),
      imageSrc: "https:" + $('img', element).attr('data-src'),
      date: $('.info-img-dt', element).text().trim(),
    };

    if (Object.values(item).every(value => value !== undefined)) {
      items.push(item);
    }
  });

  return items;
};

async function infoApp(url) {
  const proxyurl = 'https://files.xianqiao.wang/';
  try {
    const response = await fetch(proxyurl + url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = {
      version: $('div.version span').text().trim(),
      category: $('div.Category span').text().trim(),
      lastUpdated: $('div.last-updated time').text().trim(),
      installs: $('div.Installs a').text().trim(),
      developer: $('div.developer span').text().trim(),
      requires: $('div.Requirements div.item').text().trim(),
      rating: $('div.Content-Rating div.item').text().trim(),
      googlePlay: $('div.Get-it-on a').attr('href'),
      apkLink: 'https://apkgk.com' + $('div.detail-box-download a').attr('href'),
      ogImageUrl: $('meta[property="og:image"]').attr('content')
    };

    return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

async function Down(url) {
  const proxyurl = 'https://files.xianqiao.wang/';
  try {
    const response = await fetch(proxyurl + (url.endsWith('/download') ? url : url + '/download'));
    const html = await response.text();

    const $ = cheerio.load(html);
    const info = await infoApp(proxyurl + (url.replace(/\/download$/, '')));
    const data = {
      title: $('div.program-title h1').text().trim(),
      info: info,
      link: proxyurl + "https:" + $('div.c-download a').attr('href'),
    };

    return data;
  } catch (error) {
    console.log('Error:', error);
  }
}

module.exports = { Search, Down };