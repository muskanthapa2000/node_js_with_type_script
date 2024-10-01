import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define an interface for process.env to ensure types for environment variables
interface EnvVariables {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
}

// Type assertion for process.env
const env: EnvVariables = {
  DB_NAME: process.env.DB_NAME as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: parseInt(process.env.DB_PORT as string, 10),
};

// Initialize Sequelize instance
const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: 'postgres',
  port: env.DB_PORT,
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err: Error) => console.error('Unable to connect to the database:', err));

export default sequelize;
