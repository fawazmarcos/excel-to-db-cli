import { parseExcelFromStdin } from './services/excelService.js';
import { validateExcelData } from './services/validationService.js';
import { insertValidatedData } from './services/insertionService.js';
import { identifyAndReportDuplicates } from './services/duplicateService.js';
import logger from './config/logger.js';


/**
 * Exécute le processus principal de l'application CLI.
 *
 * Étapes :
 * 1. Lecture des données depuis un fichier Excel via `stdin`.
 * 2. Validation des données extraites.
 * 3. Identification et enregistrement des doublons.
 * 4. Insertion optimisée des données en base de données.
 * 5. Affichage des statistiques et des logs.
 *
 * Gestion des erreurs :
 * - Si des données invalides sont détectées, le script s'arrête.
 * - Si une erreur se produit à n'importe quelle étape, elle est loggée et l'exécution est interrompue.
 */
(async () => {
  try {
    logger.info('Insertion démarrée...');
    console.time('Durée totale du processus');

    const excelData = await parseExcelFromStdin();
    logger.info(` ${excelData.length} lignes extraites du fichier Excel.`);
    const validatedData = validateExcelData(excelData);

    const invalidData = validatedData.filter((item) => !item.isValid);
    const validData = validatedData.filter((item) => item.isValid);

    if (invalidData.length > 0) {
      logger.error(`${invalidData.length} lignes invalides détectées.`);
      process.exit(1);
    }

    logger.info('Vérification des doublons en cours...');
    const duplicates = identifyAndReportDuplicates(validData);

    logger.info('Insertion en cours, veuillez patienter...');
    await insertValidatedData(validData);

    logger.info('Insertion terminée !');

    console.warn(`============================================`);

    console.timeEnd('Durée totale du processus');
    logger.info(
      `Succès : ${validData.length} entrées insérées avec succès sur ${excelData.length} lignes du fichier Excel.`
    );

    if (duplicates.length > 0) {
  
      logger.warn(
        `${duplicates.length} doublons détectés et enregistrés dans "doublons_detectes.xlsx".`
      );
    }

    process.exit(0);
  } catch (err) {
    console.error('Erreur lors du processus global :', err);
    logger.error('Erreur lors du processus global :', err);
    process.exit(1);
  }
})();
