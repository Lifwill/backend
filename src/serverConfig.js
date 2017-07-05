const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/cst',
  port: process.env.PORT || 3000,
  sessionSecret: process.env.sessionSecret || 'cactuspiritsecretkey',
};

export default config;
