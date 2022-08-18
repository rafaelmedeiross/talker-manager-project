const fs = require('fs').promises;

const readFile = async (req, _res, next) => {
  const reading = await fs.readFile('talker.json', 'utf-8');
  const answer = JSON.parse(reading);
  req.answer = answer;
  next();
  // return answer;
};

const findPerson = async (req, res, next) => {
  const reading = await fs.readFile('talker.json', 'utf-8');
  const answer = JSON.parse(reading);
  const { id } = req.params;
  const talker = answer.find((person) => person.id === Number(id));
  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  req.person = talker;
  next();
};

// 
const { validateName, validateAge, validateTalk } = require('./validations');

const validateField = (req, res, next) => {
  const { email, password } = req.body;
  const regexEmail = /\S+@\S+\.\S+/;

  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.toString().length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length < 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

const validatePersonalCreation = (req, res, next) => {
  const { name, age, talk } = req.body;

  if (validateName(name, res)) {
    return validateName(name, res);
  }

  if (validateAge(age, res)) {
    return validateAge(age, res);
  }

  if (validateTalk(talk, res)) {
    return validadeTalk(talk, res);
  }
  next();
};

module.exports = {
validateField, validateToken, validatePersonalCreation,
  findPerson,
  readFile,
};