const fetch = require('node-fetch');
const cheerio = require('cheerio');
const conpiq = require('../config.js')

async function Search(query) {
try {
// URL yang akan diambil HTML-nya
const url = conpiq.baseUrl.apkhome + 'id/?s=' + query; // Ganti dengan URL yang sesuai

// Fetch HTML dari URL menggunakan fetch
const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);

// Cari semua elemen <li><dl><a>
const elements = $('li > dl > a');

// Array untuk menyimpan objek hasil
const result = elements.map((index, element) => {
const anchorElement = $(element);

// Ambil data dari elemen yang sesuai
const data = {
href: anchorElement.attr('href'),
imageSrc: anchorElement.find('.l img').attr('data-cfsrc') || anchorElement.find('.l img').attr('src'),
title: anchorElement.find('.r .p1').text().trim(),
edition: anchorElement.find('.r p:last-of-type').text().trim()
};

return data;
}).get();

// Tampilkan array objek JSON
return result;
} catch (error) {
console.error(error);
}
}

async function Down(url) {
try {
const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);
const ogImageUrl = $('meta[property="og:image"]').attr('content');
const gtBlockElement = $('p.gt-block');
const data = {
title: gtBlockElement.find('strong').first().text().trim(),
description: gtBlockElement.first().text().trim(),
supportedAndroid: gtBlockElement.filter(':contains("Android yang didukung")').next('br').text().trim(),
supportedAndroidVersions: gtBlockElement.filter(':contains("Versi Android yang didukung")').next('br').text().trim(),
ogImageUrl: ogImageUrl,
downloadLink: $('a[href^="https://dl2.apkhome.io"]').text().trim(),
downloadLinkURL: $('a[href^="https://dl2.apkhome.io"]').attr('href')
};

return data;
} catch (error) {
console.error(error);
}
}

module.exports = { Search, Down };