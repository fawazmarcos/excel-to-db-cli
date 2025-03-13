import * as XLSX from 'xlsx';

/**
 * Lit un fichier Excel depuis l'entrée standard (stdin), parse les données
 * et retourne une promesse résolue avec un tableau d'objets représentant les lignes.
 *
 * @returns {Promise<Array<{ matricule: string, nom: string, prenom: string, datedenaissance: string, status: string, rowNumber: number }>>}
 */
export const parseExcelFromStdin = () => {
  const buffers = [];

  return new Promise((resolve, reject) => {
    // Collecte les morceaux du flux entrant
    process.stdin.on('data', (chunk) => buffers.push(chunk));

    // À la fin du flux entrant, parse le fichier Excel
    process.stdin.on('end', () => {
      try {
        const buffer = Buffer.concat(buffers);
        const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

        // Accède à la première feuille du classeur Excel
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Transforme la feuille en tableau, en extrayant l'en-tête
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        }).slice(1);

        // Transforme chaque ligne en objet clairement structuré
        const data = rows.map((row, index) => ({
          matricule: row[0]?.toString().trim(),
          nom: row[1]?.toString().trim(),
          prenom: row[2]?.toString().trim(),
          datedenaissance: row[3],
          status: row[4]?.toString().trim(),
          rowNumber: index + 2, // Correspondance exacte avec la ligne Excel (pour débogage)
        }));

        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    process.stdin.on('error', reject);
  });
};
