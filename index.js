const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const { searchPeople, _getTalker } = require('./middleware');

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

app.get('/talker', async (_request, response) => {
  const getting = await fs.getTalker('talker.json', 'utf-8');
  const answer = JSON.parse(getting);
  response.status(200).json(answer);
});

app.get('/talker/:id', searchPeople, (request, response) => {
  response.status(200).json(request.person);
});
