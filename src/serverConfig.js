const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/cst',
  port: process.env.PORT || 3000,
  // The secret for the json web token encryption / decryption
  jwtSecret: process.env.jwtSecret || 'cactuspiritsecretkey',
  // The time that the jwt is accepted
  jwtExpiresIn: process.env.jwtExpiresIn || 60 * 60,
};

export default config;
