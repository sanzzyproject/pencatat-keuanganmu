import { openDB, IDBPDatabase } from 'idb';
import { Transaction } from '../types';

const DB_NAME = 'umkm_finance_db';
const STORE_NAME = 'transactions';
const VERSION = 1;

export async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('date', 'date');
        store.createIndex('type', 'type');
      }
    },
  });
}

export async function addTransaction(transaction: Transaction) {
  const db = await initDB();
  return db.add(STORE_NAME, transaction);
}

export async function updateTransaction(transaction: Transaction) {
  const db = await initDB();
  return db.put(STORE_NAME, transaction);
}

export async function deleteTransaction(id: number) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function clearAllTransactions() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}

export async function importTransactions(transactions: Transaction[]) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  for (const t of transactions) {
    // Remove ID to let it auto-increment or keep it if you want exact restore
    delete t.id; 
    await store.add(t);
  }
  await tx.done;
}
