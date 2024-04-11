const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function cardealer() {
  var carModel='minivan';
  const url = 'https://www.autolist.com/'+carModel;

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const carData = [];

      $('.AL-vehicle-primary-details').each((index, element) => {
        const title = $(element).find('.headline').text();
        const subtext = $(element).find('.subtext').text();
        const location = $(element).find('.location').text();
        const price = $(element).find('.pricing .headline').text();
        const monthlyPayment = $(element).find('.monthly-payment span.info-link').text().trim();

        carData.push({
          title,
          subtext,
          location,
          price,
          monthlyPayment,
        });
      });

      const carDataJSON = JSON.stringify(carData, null, 2);

      return carDataJSON
    }
  } catch (error) {
    console.error(error);
  }
}