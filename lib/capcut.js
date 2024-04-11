const cheerio = require("cheerio")
const fetch = require("node-fetch")
const got = require("got")
const conpiq = require('../config.js')

let DownUrl = conpiq.baseUrl.capcut.down
let SearchUrl = conpiq.baseUrl.capcut.search

async function Down(Url) {
	try {
		const token = Url.match(/\d+/)[0];
		const response = await fetch(`${DownUrl}api/download/${token}`, {
			method: "GET",
			headers: {
				"Accept": "/",
				"User-Agent": "Mozilla/5.0 (Linux; Android 13; CPH2217 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.5481.153 Mobile Safari/537.36",
				"X-Requested-With": "acr.browser.barebones",
				"Sec-Fetch-Site": "same-origin",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Dest": "empty",
				"Referer": "https://ssscapcut.com/",
				"Accept-Encoding": "gzip, deflate",
				"Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
				"Cookie": "sign=2cbe441f7f5f4bdb8e99907172f65a42; device-time=1685437999515"
			}
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function Search(s) {
  try {
    const response = await got(`${SearchUrl}?s=` + s);
    const html = response.body;
    const $ = cheerio.load(html);
    const elements = $("main#main div.ct-container section div.entries article");

    const detailPromises = elements.map(async (index, element) => {
      const link = $(element).find("a.ct-image-container").attr("href");
      const detail = await Detail(link);
      const imageSrc = $(element).find("img").attr("src");
      const title = $(element).find("h2.entry-title a").text().trim();

      return {
        id: $(element).attr("id"),
        link,
        detail,
        imageSrc,
        title
      };
    }).get();

    return Promise.all(detailPromises);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function Detail(link) {
  try {
    const response = await got(link);
    const html = response.body;
    const $ = cheerio.load(html);
    const elements = $("main#main div.ct-container-full article");

    return elements.map((index, element) => ({
      id: $(element).attr("id"),
      time: $("main#main").find("time.ct-meta-element-date").text().trim(),
      template: $(element).find(".wp-block-buttons .wp-block-button a").attr("data-template-id"),
      link: $(element).find("a.wp-block-button__link").attr("href"),
      imageSrc: $(element).find("video").attr("poster"),
      title: $(element).find("h2").text().trim(),
      videoSrc: $(element).find("video source").attr("src"),
      description: $(element).find(".entry-content p").text().trim()
    })).get();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  Search,
  Down,
  Detail
};
