import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

// Vérification des variables d'environnement obligatoires
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME'];
const missingEnv = requiredEnv.filter(envVar => !process.env[envVar]);

if (missingEnv.length > 0) {
  console.error(`Erreur : Les variables suivantes sont manquantes dans le fichier .env : ${missingEnv.join(', ')}`);
  process.exit(1);
}

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432, // Défaut: 5432 si non défini
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 10 },
  migrations: {
    directory: './scripts/migrations',
  }

});

export default db;