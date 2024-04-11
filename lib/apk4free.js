const cheerio = require('cheerio');
const fetch = require('node-fetch');
const conpiq = require('../config.js')

async function Search(query) {
  const url = `${conpiq.baseUrl.apk4free}?s=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const articles = [];

  $('article').each((index, element) => {
    const $article = $(element);

    articles.push({
      title: $article.find('h1.title a').text(),
      url: $article.find('h1.title a').attr('href'),
      thumbnail: $article.find('.featured-image .thumb.hover-effect span.fullimage').css('background-image').replace(/url\((.*)\)/, '$1'),
      category: $article.find('.tags a[href^="https://apk4free.org/category/"]').map((index, tagElement) => $(tagElement).text()).get(),
      tag: $article.find('.tags a[href^="https://apk4free.org/tag/"]').map((index, tagElement) => $(tagElement).text()).get(),
      description: $article.find('.post-excerpt p').text(),
      author: {
        name: $article.find('footer.author-meta a .author-name').text(),
        image: $article.find('footer.author-meta a .author-image').css('background-image').replace(/url\('(.*)'\)/, '$1'),
        count: $article.find('footer.author-meta a .author-count').text().replace(' Resources', ''),
      }
    });
  });

  return articles;
}

async function Down(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const data = [];

    $('section.post-content p, .slider img, strong a[href^="https://"]').each((index, element) => {
      const $element = $(element);

      if ($element.is('p')) {
        const content = $element.text().trim();
        if (content !== '') {
          data.push({ type: 'text', content });
        }
      } else if ($element.is('img')) {
        let src = $element.attr('src');
        if (src.startsWith('//')) {
          src = 'https:' + src;
        }
        data.push({ type: 'image', src });
      } else if ($element.is('a')) {
        let link = $element.attr('href');
        if (link.startsWith('//')) {
          link = 'https:' + link;
        }
        data.push({ type: 'download', link });
      }
    });

    const output = data.reduce((result, item) => {
      const { type, content, src, link } = item;
      if (type === 'text') {
        if (!result.text) {
          result.text = [];
        }
        result.text.push(content);
      } else if (type === 'image') {
        if (!result.image) {
          result.image = [];
        }
        result.image.push(src);
      } else if (type === 'download') {
        if (!result.download) {
          result.download = [];
        }
        result.download.push(link);
      }
      return result;
    }, {});

    return output;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  Search,
  Down
};
