import { describe, it, expect } from 'vitest';
import { validateExcelData } from '../services/validationService.js';

describe('Validation des données Excel', () => {
  it('Retourne une erreur si un champ obligatoire est manquant', () => {
    const data = [
      {
        matricule: '',
        nom: 'Doe',
        prenom: 'John',
        datedenaissance: '2000-01-01',
        status: 'Actif',
        rowNumber: 1,
      },
    ];
    const result = validateExcelData(data);
    expect(result[0].isValid).toBe(false);
    expect(result[0].errors).toContain('Le matricule est obligatoire.');
  });
  it('Accepte une date valide', () => {
    const data = [
      {
        matricule: '12345',
        nom: 'Doe',
        prenom: 'John',
        datedenaissance: '2000-01-01',
        status: 'Actif',
        rowNumber: 1,
      },
    ];
    const result = validateExcelData(data);
    expect(result[0].isValid).toBe(true);
  });});
