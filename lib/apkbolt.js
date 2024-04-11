const fetch = require('node-fetch');
const cheerio = require('cheerio');
const conpiq = require('../config.js')

async function Search(q) {
  const url = conpig.baseUrl.apkbolt + '?s=' + q; // 
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const articles = [];

    $('article.vce-post').each((index, element) => {
      const article = {};

      const metaImage = $(element).find('.meta-image');
      article.imageURL = metaImage.find('img').attr('src');
      article.title = $(element).find('.entry-title a').text().trim();
      article.link = $(element).find('.entry-title a').attr('href');
      article.categories = [];
      $(element).find('.meta-category a').each((index, element) => {
        article.categories.push($(element).text().trim());
      });

      articles.push(article);
    });

    return articles;
  } catch (error) {
    console.log(error);
  }
}

async function Down(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const mediaText = $('.wp-block-media-text');
    const content = mediaText.find('.wp-block-media-text__content');
    content.find('script').remove(); // Menghapus tag <script>
    const downloadLink = $('.redirect-press-final-link').attr('href');
    const downloadFile = await getApp(downloadLink);
    const info = {
      name: $('meta[property="og:title"]').attr('content'),
      image: $('meta[property="og:image"]').attr('content'),
      link: $('meta[property="og:url"]').attr('content'),
      downloadLink,
      downloadFile
    };

    return info;
  } catch (error) {
    console.log(error);
  }
}

async function getApp(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const mainWrapper = $('#main-wrapper');
    mainWrapper.find('script').remove(); // Menghapus tag <script>
    const downloadLink = mainWrapper.find('a').attr('href');
    return downloadLink;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { Search, Down };

