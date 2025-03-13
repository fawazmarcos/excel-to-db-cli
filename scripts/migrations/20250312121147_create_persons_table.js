
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('persons', (table) => {
      table.increments('id').primary();
  
      //table.string('matricule', 255).notNullable().unique().index();
      table.string('matricule', 255).notNullable().index();

      table.string('nom', 255).notNullable().index();
      table.string('prenom', 255).notNullable().index();
      table.date('datedenaissance').notNullable();
      table.string('status', 255).notNullable().index();
  
      table.timestamp('created_at').defaultTo(knex.fn.now()).index();
      table.timestamp('updated_at').defaultTo(knex.fn.now());
  
    });
  };
  
  export const down = async (knex) => {
    await knex.schema.dropTableIfExists('persons');
  };