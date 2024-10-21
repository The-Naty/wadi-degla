const IndexController = {};
const IndexService = require('../services/index.service');


IndexController.index = async (req, res) => {
  try {
    const respond = await IndexService.apiTest();

    res.status(200).send(respond);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = IndexController;
