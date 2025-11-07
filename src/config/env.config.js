module.exports = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER || 'reservas',
  DB_PASS: process.env.DB_PASS || '*reservas.25*',
  DB_NAME: process.env.DB_NAME || 'sgrcc_db',
  SECRET_KEY: process.env.SECRET_KEY || 'clave_secreta',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT:  587,
  SMTP_USER: 'SGRCC.mail@gmail.com',
  SMTP_PASS: 'wlbg dcxh hyao usne',
  
  ADMIN_EMAIL:'santid.prog@gmail.com'
};
