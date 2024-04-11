const fetch = require('node-fetch');
const cheerio = require('cheerio');
const conpiq = require('../config.js')

async function Search(query) {
    const url = `${conpiq.baseUrl.apk4all}search/${query}`; 

    try {
        const response = await fetch(url);
        const data = await response.text();
        const $ = cheerio.load(data);
        const articles = [];

        $('article').each((index, element) => {
            const $article = $(element);
            const title = $article.find('.entry-title a').text().trim();
            const titleUrl = $article.find('.entry-title a').attr('href');
            const imageUrl = $article.find('.apk-dl .icon img').attr('src');
            const rating = $article.find('.details-rating .average.rating').text().trim();
            const views = $article.find('.details-rating .details-delimiter').eq(1).text().replace(/\n|\|\s|\t/g, '').trim();
            const updateDate = $article.find('.details-rating .update-date').next().text().trim();

            articles.push({ 
            title, 
            titleUrl, 
            imageUrl, 
            rating, 
            views, 
            updateDate });
        });

        return articles;
    } catch (error) {
        return `Error fetching data: ${error}`
    }
}

async function Down(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const info = {
            title: $('.dllinks .da').attr('title'),
            link: $('.dllinks .da').attr('href'),
            ogImageUrl: $('meta[property="og:image"]').attr('content'),
            developer: $('td:contains("Developer:")').next().text().trim(),
            currentVersion: $('td:contains("Current Version:")').next().text().trim(),
            latestUpdate: $('td:contains("Latest Update:")').next().find('time').text().trim(),
            contentRating: $('td:contains("Content Rating:")').next().text().trim(),
            getItOn: $('td:contains("Get it on:")').next().find('a').attr('href'),
            requirements: $('td:contains("Requirements:")').next().find('a').text().trim(),
            appID: $('td:contains("App ID:")').next().text().trim()
        };

        const response2 = await fetch(info.link);
        const html2 = await response2.text();
        const $two = cheerio.load(html2);

        const download = {
            title: $two('.box h1.title').text().trim(),
            linkFull: $two('.box p.field a.button.is-danger').attr('href'),
            linkMod: $two('.box div.buttons div.field p.control a.button.is-primary').attr('href'),
            size: $two('.box div.field.has-addons p.control.is-expanded a.button.is-primary').text().trim(),
            qr: $two('.box div.field.has-addons p.control a.zb.button.is-primary img.qr').attr('src'),
            guide: $two('.box div.block.content.notification.is-info.is-light.container').text().trim()
        };

        return { info, download };
    } catch (error) {
        return `Error fetching additional information: ${error}`
    }
};

module.exports = { Search, Down };
