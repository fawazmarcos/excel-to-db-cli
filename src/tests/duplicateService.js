import { describe, it, expect } from 'vitest';
import { identifyAndReportDuplicates } from '../services/duplicateService.js';

describe('Gestion des doublons', () => {
  it('Détecte et enregistre les doublons correctement', () => {
    const data = [
      { matricule: '123', nom: 'Doe', prenom: 'John', rowNumber: 1 },
      { matricule: '456', nom: 'Smith', prenom: 'Jane', rowNumber: 2 },
      { matricule: '123', nom: 'Dupont', prenom: 'Pierre', rowNumber: 3 }, // Doublon
    ];

    const duplicates = identifyAndReportDuplicates(data);

    expect(duplicates.length).toBe(1);
    expect(duplicates[0].matricule).toBe('123');
    expect(duplicates[0].doublon_avec).toBe(1); // Première occurrence à la ligne 1
  });
});
