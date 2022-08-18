const authoValidate = (req, res, next) => {
  const { authorization } = req.headers;
  
  if (authorization === undefined) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  
  if (!authorization || authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  return next();
  };

  function validateName(name) {
    if (!name) {
      throw new Error('O campo "name" é obrigatório');
    }
  
    if (name.length < 4) {
      throw new Error('O "name" deve ter pelo menos 3 caracteres');
    }
  }
  
  function validateAge(age) {
    if (!age) {
      throw new Error('O campo "age" é obrigatório');
    }
  
    if (age < 18) {
      throw new Error('A pessoa palestrante deve ser maior de idade');
    }
  }
  
  function validateTalk(talk) {
    if (!talk) {
      throw new Error('O campo "talk" é obrigatório');
    }
  
    if (!talk.watchedAt) {
      throw new Error('O campo "watchedAt" é obrigatório');
    }
  
    const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
    if (!dateRegex.test(talk.watchedAt)) {
      throw new Error('O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
    }
  }
  
  function validateTalkRate(rate) {
    if (rate === undefined) {
      throw new Error('O campo "rate" é obrigatório');
    }
  
    if (rate < 1 || rate > 5) {
      throw new Error('O campo "rate" deve ser um inteiro de 1 à 5');
    }
  }
  
  const validateTalker = async (req, res, next) => {
    const { name, age, talk } = req.body;
  
    try {
      validateName(name);
      validateAge(age);
      validateTalk(talk);
      validateTalkRate(talk.rate);
      return next();
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };
  
  module.exports = {

    validateTalker,
    authoValidate,

    };