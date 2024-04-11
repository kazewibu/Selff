const cheerio = require('cheerio')
const fetch = require('node-fetch')
const conpiq = require('../config.js')

async function Search(query) {
const url = `${conpiq.baseUrl.apkmirror}?post_type=app_release&searchtype=apk&s=${encodeURIComponent(query)}`;

try {
const response = await fetch(url);
const body = await response.text();
const $ = cheerio.load(body);

return $('.appRow')
.map((_, element) => ({
image: "https://www.apkmirror.com" + $(element).find('.ellipsisText').attr('src'),
link: "https://www.apkmirror.com" + $(element).find('.appRowTitle a').attr('href'),
title: $(element).find('.appRowTitle a').text().trim(),
developer: $(element).find('.byDeveloper').text().trim(),
uploadDate: $(element).find('.dateyear_utc').text().trim(),
version: $(element).next('.infoSlide').find('.infoSlide-value').eq(0).text().trim(),
fileSize: $(element).next('.infoSlide').find('.infoSlide-value').eq(2).text().trim(),
downloads: $(element).next('.infoSlide').find('.infoSlide-value').eq(3).text().trim()
}))
.get()
.filter(obj => Object.values(obj).every(value => value !== ''))
} catch (error) {
throw error;
}
}


async function Down(url) {
try {
const response = await fetch(url);
const html = await response.text();
const $ = cheerio.load(html);

const link = 'https://www.apkmirror.com' + $('.downloadButton').attr('href')

if (link.includes('#downloads')) {

const link2 = $('meta[property="og:url"]').attr('content') + "#downloads"
const responses2 = await fetch(link2);
const htmls2 = await responses2.text();
const $s = cheerio.load(htmls2);
const result = [];

$s('.table-row.headerFont').each((index, row) => {
const rowData = {
version: $s(row).find('a.accent_color').text().trim(),
bundle: $s(row).find('.apkm-badge.success').eq(0).text().trim(),
splits: $s(row).find('.apkm-badge.success').eq(1).text().trim(),
apkUrl: 'https://www.apkmirror.com' + $s(row).find('a.accent_color').attr('href'),
downloadDate: $s(row).find('.dateyear_utc').data('utcdate')
};

// Memeriksa apakah setidaknya salah satu properti memiliki nilai
const hasOutput = Object.values(rowData).some(value => value !== undefined && value !== '');
if (hasOutput) {
result.push(rowData);
}
});
const response3 = await fetch(result[1].apkUrl);
const html3 = await response3.text();
const $t = cheerio.load(html3);

const link3 = 'https://www.apkmirror.com' + $t('.downloadButton').attr('href')

const response2 = await fetch(link3);
const html2 = await response2.text();
const $$ = cheerio.load(html2);

const formElement2 = $$('#filedownload');
const id2 = formElement2.find('input[name="id"]').attr('value');
const key2 = formElement2.find('input[name="key"]').attr('value');

const linkdl = `${conpiq.baseUrl.apkmirror}wp-content/themes/APKMirror/download.php?id=${id2}&key=${key2}`;

return {
title: $('meta[property="og:title"]').attr('content'),
gambar: $('meta[property="og:image"]').attr('content'),
link: link,
linkdl: linkdl,
downloadText: $('.downloadButton').text().trim(),
author: url.split('/')[4].toUpperCase(),
info: $('.infoSlide').text().trim(),
description: $('#description .notes').text().trim()
};
} else {
const response2 = await fetch(link);
const html2 = await response2.text();
const $$ = cheerio.load(html2);

const formElement = $$('#filedownload');
const id = formElement.find('input[name="id"]').attr('value');
const key = formElement.find('input[name="key"]').attr('value');
const forcebaseapk = formElement.find('input[name="forcebaseapk"]').attr('value');
const linkdl = `${conpiq.baseUrl.apkmirror}wp-content/themes/APKMirror/download.php?id=${id}&key=${key}&forcebaseapk=${forcebaseapk}`;

return {
title: $('meta[property="og:title"]').attr('content'),
gambar: $('meta[property="og:image"]').attr('content'),
link: link,
linkdl: linkdl,
downloadText: $('.downloadButton').text().trim(),
author: url.split('/')[4].toUpperCase(),
info: $('.appspec-value').text().trim(),
description: $('#description .notes').text().trim(),
size: $('.appspec-row:nth-child(2) .appspec-value').text().trim(),
tanggal: $('.appspec-row:last-child .appspec-value .datetime_utc').attr('data-utcdate')
}
}
} catch (error) {
console.error('Terjadi kesalahan:', error);
}
}

module.exports = { Search, Down };