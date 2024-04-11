const cheerio = require('cheerio')
const fetch = require('node-fetch')
const conpiq = require('../config.js')


async function Search(query) {
  const response = await fetch(conpiq.baseUrl.appvn + "/android/search?keyword=" + query); // Ganti URL dengan URL yang sesuai
  const body = await response.text();

  const $ = cheerio.load(body);
  const resultArray = [];

  $("div.section-content li.item").each((index, element) => {
    const item = {
      title: $(element).find("div.info > a").text().trim(),
      url: link + $(element).find("div.info > a").attr("href"),
      image: $(element).find("img.lazy").attr("data-src"),
      version: $(element).find("div.vol-chap.ver.text-left > p:first-child").text().trim(),
      date: $(element).find("div.vol-chap.ver.text-left > p.new-chap").text().trim(),
      author: $(element).find("div.new-chap.author > a").text().trim(),
      detailLink: link + $(element).find("div.btn.btn-download > a").attr("href"),
    };

    resultArray.push(item);
  });

  return resultArray;
}

async function infoAppVn(url) {
  try {
    const response = await fetch(url); // Ganti URL dengan URL sumber data Anda
    const html = await response.text();
    const $ = cheerio.load(html);

    const infoTab = $('#info');

    const data = {
      version: infoTab.find('p:nth-child(1)').text().trim().replace('Version: ', ''),
      req: infoTab.find('p:nth-child(2)').text().trim().replace('Req: ', ''),
      latestUpdate: infoTab.find('p:nth-child(3)').text().trim().replace('Latest update: ', ''),
      downloadLink: conpiq.baseUrl.appvn + $('.btn-download a').attr('href'),
      descriptionTitle: $('#des h2').text().trim(),
      descriptionShort: $('#des span._without_desc').text().trim(),
      descriptionFull: $('#des span._full_desc div').text().trim(),
      screenshots: $('#screenshots img').map((_, element) => $(element).attr('src')).get(),
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content')
    };

    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function Down(url) {
const data = await infoAppVn(url)

  try {
    const response = await fetch(data.downloadLink); // Ganti URL dengan URL sumber data Anda
    const html = await response.text();
    const $ = cheerio.load(html);

    const infoDiv = $('#info');

    const onclickValue = infoDiv.find('.btn-download a').attr('onclick');
    const matches = onclickValue.match(/dowload\('([^']*)', '([^']*)', '([^']*)', '([^']*)'\);return false;/);
    const downloadArgs = matches.slice(1);
    
    const get_app = await downloadApk(downloadArgs[0], downloadArgs[1], downloadArgs[2], downloadArgs[3])

    const downloadObj = {
      versionId: downloadArgs[0],
      sopcastId: downloadArgs[1],
      packageName: downloadArgs[2],
      versionCode: downloadArgs[3],
      about: data,
      download: get_app
    };

    return downloadObj;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function downloadApk(latestVersion, sopcastId, package_name, version_code = 0) {
try {
    const response = await fetch(conpiq.baseUrl.appvn + '/link-download-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latest: latestVersion,
        sopcast_id: sopcastId,
        package_name: package_name,
        version_code: version_code,
      }),
    });

    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { Search, Down };