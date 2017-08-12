const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/cst',
  port: process.env.PORT || 3000,
  // The secret for the json web token encryption / decryption
  jwtSecret: process.env.jwtSecret || 'cactuspiritsecretkey',
  // The time that the jwt is accepted
  jwtExpiresIn: process.env.jwtExpiresIn || 60 * 60,

  // The smtp user to send emails
  smtpHost: process.env.smtpHost || 'smtpHost',
  smtpUser: process.env.smtpUser || 'smtpUser',
  smtpPassword: process.env.smtpPassword || 'smtpPassword',
  smtpPort: process.env.smtpPort || 465,
  smtpSecure: process.env.smtpSecure || true,
  smtpFrom: process.env.smtpFrom || 'smtpFrom',
  // WARNING : it is only for dev purpose and should not be used in other cases
  DEV_SmtpTo: process.env.DEV_SmtpTo || null,
};

export default config;
