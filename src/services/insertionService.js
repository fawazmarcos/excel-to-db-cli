import db from '../config/db.js';

const BATCH_SIZE = 5000; // Taille optimale des lots d'insertion


/**
 * Insère un lot de données validées dans la base de données.
 * @param {Array} validatedData - Liste des données validées.
 * @returns {Promise<void>} - Une promesse qui se résout une fois l’insertion terminée.
 */
export const insertValidatedData = async (validatedData) => {
  const chunks = [];

  for (let i = 0; i < validatedData.length; i += BATCH_SIZE) {
    chunks.push(validatedData.slice(i, i + BATCH_SIZE));
  }

  for (const chunk of chunks) {
    try {
      await db.batchInsert(
        'persons',
        chunk.map((item) => ({
          matricule: item.matricule,
          nom: item.nom,
          prenom: item.prenom,
          datedenaissance: item.datedenaissance,
          status: item.status,
        }))
      );
      //console.log(`✅ Lot de ${chunk.length} entrées inséré avec succès.`);
    } catch (error) {
      console.error('❌ Erreur lors de l’insertion du lot :', error);
      throw error; // Important : arrêter clairement en cas d’erreur
    }
  }
};
