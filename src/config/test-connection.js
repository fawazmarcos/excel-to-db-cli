import knex from './db.js';

(async () => {
  try {
    await knex.raw('SELECT 1+1 AS result');
    console.log(' Connexion réussie à la base de données.');
    process.exit(0);
  } catch (err) {
    console.error(' Erreur connexion DB :', err);
    process.exit(1);
  }
})();
