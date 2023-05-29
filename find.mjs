import {promises as fs} from 'fs';
import prompt from 'prompt';

const schema = {
  properties: {
    position: {
      pattern: /^[0-9]+$/,
      message: 'You can only enter in numbers fool',
      required: true
    }
  }
}

prompt.get(schema, async function (err, result) {
  if (err) {
    console.error(err);
  }
   await getMovie(result.position);
});

const getMovie = async (position) => {
  const data = await fs.readFile('movies.json');
  const movies = JSON.parse(data);
  const movie = movies.list.find(x => x.position === `${position}.`);
  console.log(movie);
}