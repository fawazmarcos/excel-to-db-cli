import { describe, it, expect, vi } from 'vitest';
import { insertValidatedData } from '../services/insertionService.js';
import db from '../config/db.js';

// Mock de la base de données
vi.mock('../config/db.js', async () => {
    return {
      default: {
        batchInsert: vi.fn(() => Promise.resolve()), // Simule une insertion réussie
      },
    };
  });

describe('Insertion des données en base', () => {
  it('Insère les données sans erreur', async () => {
    const validData = [
      {
        matricule: '123',
        nom: 'John',
        prenom: 'Doe',
        datedenaissance: '2000-01-01',
        status: 'Actif',
      },
      {
        matricule: '456',
        nom: 'Jane',
        prenom: 'Smith',
        datedenaissance: '1995-06-15',
        status: 'Actif',
      },
    ];

    await insertValidatedData(validData);

    expect(db.batchInsert).toHaveBeenCalledTimes(1);
    expect(db.batchInsert).toHaveBeenCalledWith('persons', validData);
  });
});
