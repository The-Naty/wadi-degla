const IndexService = {};

IndexService.apiTest = async () => {
  try {
    const respond = 'Welcome to Zanaty API!';
    return respond;
  } catch (error) {
    return { error: 'Internal server error' };
  }
};

module.exports = IndexService;
