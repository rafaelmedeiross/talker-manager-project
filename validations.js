const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (!(/[a-zA-Z0-9]+@[a-zA-Z]+.com/.test(email))) {
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    } 
    next();
  };
  
  const validatePassword = (req, res, next) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }
  
    if (password.length < 6) {
      return res.status(400)
        .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    next();
  };
  const validateToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token não encontrado' });
    }
    if (authorization.length !== 16) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    next();
  };
  
  const validateName = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
      return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    next();
  };
  
  const validateAge = (req, res, next) => {
    const { age } = req.body;
    if (!age) {
      return res.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < 18) {
      return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
    }
    next();
  };
  
  const validateTalk = (req, res, next) => {
    const { talk } = req.body;
    if (!talk) {
      return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
    }
    next();
  };
  
  const validateWatchedAt = (req, res, next) => {
    const { talk } = req.body;
    if (!talk.watchedAt) {
      return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    }
    if (!(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/).test(talk.watchedAt)) {
      return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
    next();
  };
  
  const validateRate = (req, res, next) => {
    const { talk } = req.body;
    if (!talk.rate || talk.rate === ' ') {
      return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    if (talk.rate < 1 || talk.rate > 5) {
      return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
    next();
  };
  
  const validateRate0 = (req, res, next) => {
    const { talk } = req.body;
    if (talk.rate === 0) {
      return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
    next();
  };
  
  module.exports = { 
    validateEmail,
    validatePassword, 
    validateToken,
    validateName,
    validateAge,
    validateTalk,
    validateRate,
    validateWatchedAt,
    validateRate0 };