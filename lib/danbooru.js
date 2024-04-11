const axios = require("axios")
const cheerio = require("cheerio")

module.exports = async function danbooru(url) {
	let html = (await axios.get(url)).data
	let $ = cheerio.load(html), obj = {}
	$('#post-information > ul > li').each((idx, el) => {
		let str = $(el).text().trim().replace(/\n/g, '').split(': ')
		obj[str[0]] = str[1].replace('»', '').trim().split(' .')[0]
	})
	obj.url = $('#post-information > ul > li[id="post-info-size"] > a').attr('href')
	return obj
}
