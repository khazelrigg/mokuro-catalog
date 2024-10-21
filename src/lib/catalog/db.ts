import type { Volume } from '$lib/types';
import Dexie, { type Table } from 'dexie';

// Define the structure of the catalog entry
export interface Catalog {
  id: string;   // Unique ID for each manga series
  manga: Volume[];  // List of volumes in the series
}

// Extend Dexie to create a custom database
export class CatalogDexie extends Dexie {
  catalog!: Table<Catalog>;  // Define the "catalog" table

  constructor() {
    super('mokuro');  // Name the database 'mokuro'
    this.version(1).stores({
      catalog: 'id, manga'  // Define the schema for the catalog table
    });
  }
}

// Export an instance of the database
export const db = new CatalogDexie();
