const axios = require('axios')
const cheerio = require('cheerio')
const conpiq = require('../config.js')

async function Latest() {
	let html = (await axios.get(conpiq.baseUrl.anoboy)).data
	let $ = cheerio.load(html), arr = []
	$('div.home_index > a').each((idx, el) => {
		arr.push({
			judul: $(el).attr('title'),
			cover: $(el).find('div.amv > amp-img').attr('src'),
			link: $(el).attr('href')
		})
	})
	return arr
}

async function Detail(url) {
	let html = (await axios.get(url)).data
	let $ = cheerio.load(html), obj = {}
	obj.title = $('div.pagetitle > h1').text().trim().replace(/Subtitle Indonesia/, '')
	obj.episode = /Episode/.test(obj.title) ? obj.title.split(' Episode ')[1] : 'Movie'
	obj.update = $('div.breadcrumb > span > time').attr('datetime')
	$('div.contenttable > table > tbody > tr').each((idx, el) => {
		let text = $(el).find('th').text().toLowerCase()
		if (/semua/.test(text)) return
		obj[text] = $(el).find('td').text()
	})
	obj.sinopsis = $('div.contentdeks').text().trim() || $('div.unduhan').eq(0).text().trim()
	obj.cover = $('div.sisi > amp-img').attr('src')
	obj.download = {}
	$('#colomb > p > span').each((idx, el) => {
		let site = $(el).find('span').text()
		obj.download[site] = {}
		$(el).find('a').each((idx2, el2) => {
			let quality = $(el2).text().replace('SD', '').toLowerCase()
			obj.download[site][quality] = $(el2).attr('href')
		})
	})
	return obj
}

module.exports = {
  Latest,
  Detail
}