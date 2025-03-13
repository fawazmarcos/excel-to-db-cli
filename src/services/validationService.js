import { parse, isValid } from 'date-fns';

// Liste complète des formats de date acceptés
const dateFormats = [
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'dd/MM/yyyy',
  'MM-dd-yyyy',
  'dd-MM-yyyy',
  'yyyy/MM/dd',
];

/**
 * Parse une date dans plusieurs formats possibles et retourne une date normalisée
 * au format ISO (YYYY-MM-DD).
 *
 * @param {string|Date} dateValue La date à parser.
 * @returns {string|null} La date formatée ou null si invalide.
 */
const parseDate = (dateValue) => {
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }

  if (typeof dateValue !== 'string') {
    return null;
  }

  // Nettoyage des espaces inutiles dans la date
  const dateString = dateValue.replace(/\s+/g, '');

  // Tente de parser avec chaque format spécifié jusqu'à obtenir une date valide
  for (const format of dateFormats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate.toISOString().split('T')[0];
    }
  }

  // Retourne null si aucun format ne correspond
  return null;
};

/**
 * Valide explicitement les données issues du fichier Excel et indique les erreurs.
 *
 * @param {Array<{ matricule: string, nom: string, prenom: string, datedenaissance: string, status: string, rowNumber: number }>} data
 * @returns {Array<{ rowNumber: number, matricule: string, nom: string, prenom: string, datedenaissance: string|null, status: string, isValid: boolean, errors: string[] }>}
 */
export const validateExcelData = (data) => {
  return data.map((entry) => {
    const errors = [];

    // Vérifications explicites des champs obligatoires
    if (!entry.matricule) errors.push('Le matricule est obligatoire.');
    if (!entry.nom) errors.push('Le nom est obligatoire.');
    if (!entry.prenom) errors.push('Le prénom est obligatoire.');
    if (!entry.status) errors.push('Le statut est obligatoire.');

    // Validation approfondie de la date de naissance
    const formattedDate = parseDate(entry.datedenaissance);
    if (!formattedDate) errors.push('Format de date invalide ou manquant.');

    // Retourne l'objet enrichi avec les informations de validation
    return {
      rowNumber: entry.rowNumber,
      matricule: entry.matricule,
      nom: entry.nom,
      prenom: entry.prenom,
      datedenaissance: formattedDate || null,
      status: entry.status,
      isValid: errors.length === 0,
      errors,
    };
  });
};
