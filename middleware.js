const fs = require('fs').promises;

const getTalker = async (require, _response, next) => {
    const reading = await fs.getTalker('talker.json', 'utf-8');
    const answer = JSON.parse(reading);
    req.answer = answer;
    next();
  };

const searchPeople = async (request, response) => {
  const reading = await fs.getTalker('talker.json', 'utf-8');
  const { id } = request.params;
  const talker = JSON.parse(reading).find((person) => person.id === Number(id));
  if (!talker) {
    return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  request.person = talker;
};

module.exports = {
  searchPeople,
};