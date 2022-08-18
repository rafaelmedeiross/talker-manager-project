const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const { validateTalker, authoValidate } = require('./middleware');
// require('express-async-errors');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const writeFile = async (conteudo) => {
  await fs.writeFile('./talker.json', JSON.stringify(conteudo));
};

const readFile = async () => {
  const talkers = await fs.readFile('./talker.json', 'utf8');
  return JSON.parse(talkers);
};

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (request, response) => {
  const talkers = await readFile();
  response.status(200).json(talkers);
});

app.get('/talker/search', authoValidate, async (req, res) => {
  try {
    const talkers = await readFile();
    const { q } = req.query;

    const talkerFiltrados = talkers.filter((t) => 
      t.name.toLowerCase().indexOf(q.toLowerCase()) >= 0);
    return res.status(200).json(talkerFiltrados);
  } catch (error) {
    return res.status(500).end();
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const talkers = await readFile();
    const { id } = req.params;
    const talker = talkers.find((t) => t.id === Number(id));
    if (!talker) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talker);
  } catch (error) {
    return res.status(500).end();
  }
});

function emailIsValid(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function validationLoginFields(email, password) {
  if (email === undefined) {
    return 'O campo "email" é obrigatório';
  }
  if (!emailIsValid(email)) {
    return 'O "email" deve ter o formato "email@email.com"';
  }
  if (password === undefined) {
    return 'O campo "password" é obrigatório';
  }
  if (password.length < 6) {
    return 'O "password" deve ter pelo menos 6 caracteres';
  }
  return true;
}

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const validaCampos = validationLoginFields(email, password);
    if (validaCampos !== true) {
      return res.status(400).json({ message: validaCampos });
    }
    const token = crypto.randomBytes(8).toString('hex');
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).end();
  }
});

app.post('/talker', authoValidate, validateTalker, async (req, res) => {
  const talker = req.body;
  const talkers = await readFile();
  const pegaMaiorID = talkers.reduce((prev, current) => (
    (prev.id > current.id) ? prev : current));
  talker.id = pegaMaiorID.id + 1;
  talkers.push(talker);
  await writeFile(talkers);
 res.status(201).json(talker);
});

app.put('/talker/:id', authoValidate, validateTalker, async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkers = await readFile();
  const index = talkers.findIndex((findTalker) => findTalker.id === Number(id));
  talkers[index] = { ...talkers[index], name, age, talk };
  await writeFile(talkers);
 res.status(200).json(talkers[index]);
});

app.delete('/talker/:id', authoValidate, async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();
  const index = talkers.findIndex((findTalker) => findTalker.id === Number(id));
  talkers.splice(index, 1);
  await writeFile(talkers);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
