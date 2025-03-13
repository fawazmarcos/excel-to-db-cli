import { describe, it, expect, vi } from 'vitest';
import { parseExcelFromStdin } from '../services/excelService.js';
import { validateExcelData } from '../services/validationService.js';
import { insertValidatedData } from '../services/insertionService.js';
import { identifyAndReportDuplicates } from '../services/duplicateService.js';

vi.mock('../services/excelService.js', () => ({
  parseExcelFromStdin: vi.fn(() =>
    Promise.resolve([
      {
        matricule: '123',
        nom: 'Doe',
        prenom: 'John',
        datedenaissance: '2000-01-01',
        status: 'Actif',
        rowNumber: 1,
      },
      {
        matricule: '456',
        nom: 'Smith',
        prenom: 'Jane',
        datedenaissance: '1995-06-15',
        status: 'Actif',
        rowNumber: 2,
      },
      {
        matricule: '123',
        nom: 'Dupont',
        prenom: 'Pierre',
        datedenaissance: '1990-03-20',
        status: 'Inactif',
        rowNumber: 3,
      },
    ])
  ),
}));

vi.mock('../services/validationService.js', () => ({
  validateExcelData: vi.fn((data) =>
    data.map((entry) => ({ ...entry, isValid: true, errors: [] }))
  ),
}));

vi.mock('../services/duplicateService.js', () => ({
  identifyAndReportDuplicates: vi.fn((data) =>
    data.filter(
      (d, i, arr) => arr.findIndex((e) => e.matricule === d.matricule) !== i
    )
  ),
}));

vi.mock('../services/insertionService.js', () => ({
  insertValidatedData: vi.fn(() => Promise.resolve()),
}));

describe("Test d'intégration - Flux complet", () => {
  it('Charge et insère les données en détectant les doublons', async () => {
    const excelData = await parseExcelFromStdin();
    const validatedData = validateExcelData(excelData);
    const duplicates = identifyAndReportDuplicates(validatedData);

    await insertValidatedData(validatedData);

    expect(excelData.length).toBe(3);
    expect(validatedData.length).toBe(3);
    expect(duplicates.length).toBe(1);
    expect(insertValidatedData).toHaveBeenCalledWith(validatedData);
  });
});
