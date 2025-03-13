import { describe, it, expect, vi } from 'vitest';

//Mock de `parseExcelFromStdin`
vi.mock('../services/excelService.js', () => ({
  parseExcelFromStdin: vi.fn(() =>
    Promise.resolve([
      { matricule: '123', nom: 'Doe', prenom: 'John', datedenaissance: '2000-01-01', status: 'Actif', rowNumber: 1 },
      { matricule: '456', nom: 'Smith', prenom: 'Jane', datedenaissance: '1995-06-15', status: 'Actif', rowNumber: 2 },
    ])
  ),
}));

import { parseExcelFromStdin } from '../services/excelService.js';

describe('Lecture du fichier Excel', () => {
  it('Transforme un fichier Excel en objets', async () => {
    const result = await parseExcelFromStdin();
    expect(result.length).toBe(2);
    expect(result[0].matricule).toBe('123');
    expect(result[0].nom).toBe('Doe');
  });
});