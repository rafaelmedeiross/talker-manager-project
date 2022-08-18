const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { readFile, findPerson } = require('./middleware');
const { validateField, validateToken, validatePersonalCreation } = require('./middleware');
const generationToken = require('./generationToken');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const file = 'talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const dataPeople = await fs.readFile(file, 'utf-8');
  const jsonData = JSON.parse(dataPeople);

  if (!req.query.q) return res.status(200).json(jsonData);

  const containLyrics = jsonData.filter(({ name }) => name.includes(q));

  if (containLyrics.length === 0) return res.status(200).json(containLyrics);
  
  res.status(200).json(containLyrics);
});

app.get('/talker/:id', findPerson, (req, res) => {
  res.status(200).json(req.person);
});

app.put('/talker/:id', validateToken, validatePersonalCreation, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  const dataPeople = await fs.readFile(file, 'utf-8');
  const jsonData = JSON.parse(dataPeople);

  const person = jsonData.findIndex((obj) => obj.id === Number(id));
  const removePerson = jsonData.filter((obj) => obj.id !== Number(id));

  if (person === -1) return res.status(404).json({ message: 'Talker not found!' });

  const save = { ...jsonData[person], name, age, talk };

  await fs.writeFile(file,
  JSON.stringify([...removePerson, jsonData[person] = save]));

  res.status(200).json(save);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const dataPeople = await fs.readFile(file, 'utf-8');
  const jsonData = JSON.parse(dataPeople);

  const removePerson = jsonData.filter((obj) => obj.id !== Number(id));

  await fs.writeFile(file,
  JSON.stringify(removePerson));

  res.status(204).end();
});

app.post('/login', validateField, generationToken, (req, res) => {
  res.status(200).json({ token: req.headers.authorization });
});

app.get('/talker', readFile, (req, res) => {
  res.status(200).json(req.answer);
});

app.post('/talker', validateToken, validatePersonalCreation, async (req, res) => {
  const dataPeople = await fs.readFile(file, 'utf-8');
  const jsonData = JSON.parse(dataPeople);
  jsonData.push(req.body);
  const rewriteFile = jsonData.map((item, index) => ({ ...item, id: 1 + index }));
  await fs.writeFile(file, JSON.stringify(rewriteFile));
  res.status(201).json(rewriteFile[rewriteFile.length - 1]);
});

app.listen(PORT, () => {
  console.log('Online');
});