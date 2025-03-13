import * as XLSX from 'xlsx';

/**
 * Identifie les doublons dans les données et génère un fichier Excel.
 * @param {Array} data - Liste des données validées.
 * @returns {Array} - Liste des entrées dupliquées.
 */
export const identifyAndReportDuplicates = (data) => {
  const duplicates = [];
  const seenMatricules = new Map();

  data.forEach((entry) => {
    if (seenMatricules.has(entry.matricule)) {
      const firstOccurrenceRow = seenMatricules.get(entry.matricule);
      duplicates.push({
        ...entry,
        doublon_avec: firstOccurrenceRow,
      });
    } else {
      seenMatricules.set(entry.matricule, entry.rowNumber);
    }
  });

  if (duplicates.length > 0) {
    generateDuplicatesExcel(duplicates);
  }

  return duplicates;
};

/**
 * Génère un fichier Excel contenant les doublons détectés.
 * @param {Array} duplicates - Liste des données dupliquées.
 */
const generateDuplicatesExcel = (duplicates) => {
  const workbook = XLSX.utils.book_new();

  const duplicateSheet = duplicates.map((dup) => ({
    Matricule: dup.matricule,
    Ligne_Excel: dup.rowNumber,
    Nom: dup.nom,
    Prenom: dup.prenom,
    DateDeNaissance: dup.datedenaissance,
    Statut: dup.status,
    Doublon_Avec_Ligne: dup.doublon_avec,
  }));

  const worksheet = XLSX.utils.json_to_sheet(duplicateSheet);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Doublons');

  XLSX.writeFile(workbook, 'doublons_detectes.xlsx');
};
