module.exports = {
	DB_HOST: process.env.DB_HOST || '127.0.0.1',
	DB_PORT: Number(process.env.DB_PORT) || 3306,
	DB_USER: process.env.DB_USER || 'root',
	DB_PASS: process.env.DB_PASS || '',
	DB_NAME: process.env.DB_NAME || 'sgrcc_db',
    SECRET_KEY: process.env.SECRET_KEY || 'clave_secreta',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
};

