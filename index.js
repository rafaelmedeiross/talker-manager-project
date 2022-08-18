const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const { searchPeople } = require('.middleware');
const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const reading = await fs.readFile('talker.json', 'utf-8');
  const answer = JSON.parse(reading);
  res.status(200).json(answer);
});

app.get('/talker/:id', searchPeople, (require, response) => {
  const reading = await fs.readFile('talker.json', 'utf-8');	  response.status(200).json(require.person);
  const answer = JSON.parse(reading);	})