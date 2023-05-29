import cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs';

const movieList = [];

async function performScraping(page) {
  console.info('PAGE: ', page);
  const axiosResponse = await axios.request({
      method: "GET",
      url: `https://www.metacritic.com/browse/movies/score/metascore/all/filtered?sort=desc&page=${page}`,
      headers: {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
      }
  });

  const $ = cheerio.load(axiosResponse.data);
  const rows = $('.browse_list_wrapper table tr:not(.spacer)');
  if (rows.length === 0) {
    throw new Error('reached empty list');
  }
  console.info(`rows: ${rows.length}`);

  rows.each((i, r) => {
    const position = $(r).find('.title.numbered').text().trim();
    const title = $(r).find('.title h3').text().trim();
    const released = $(r).find('.clamp-details span:first-child').text().trim();
    const score = $(r).find('.clamp-score-wrap').text().trim();
    const summary = $(r).find('.summary').text().trim();
    const link = 'https://www.metacritic.com' + $(r).find('a.title').attr('href');
    movieList.push({position, title, released, score, summary, link});
  })
}

for (let i = 0; i < 1000; i++) {
  try {
    await performScraping(i);
  }
  catch (ex) {
    console.info(ex.message);
    break;
  }
}

const data = JSON.stringify({list: movieList});
console.info('Writing movies.json file')
fs.writeFileSync('movies.json', data);

