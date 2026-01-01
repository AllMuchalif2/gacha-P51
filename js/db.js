// Database Module - IndexedDB Management
const DB_NAME = "GachaKelompokDB";
const DB_VERSION = 1;
const STORE_ANGGOTA = "anggota";
const STORE_KELOMPOK = "kelompok";

class Database {
  constructor() {
    this.db = null;
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create anggota store
        if (!db.objectStoreNames.contains(STORE_ANGGOTA)) {
          const anggotaStore = db.createObjectStore(STORE_ANGGOTA, {
            keyPath: "id",
            autoIncrement: true,
          });
          anggotaStore.createIndex("nama", "nama", { unique: false });
        }

        // Create kelompok store
        if (!db.objectStoreNames.contains(STORE_KELOMPOK)) {
          const kelompokStore = db.createObjectStore(STORE_KELOMPOK, {
            keyPath: "id",
            autoIncrement: true,
          });
          kelompokStore.createIndex("timestamp", "timestamp", {
            unique: false,
          });
        }
      };
    });
  }

  // ANGGOTA OPERATIONS

  async addAnggota(nama) {
    const transaction = this.db.transaction([STORE_ANGGOTA], "readwrite");
    const store = transaction.objectStore(STORE_ANGGOTA);
    return new Promise((resolve, reject) => {
      const request = store.add({ nama });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllAnggota() {
    const transaction = this.db.transaction([STORE_ANGGOTA], "readonly");
    const store = transaction.objectStore(STORE_ANGGOTA);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateAnggota(id, nama) {
    const transaction = this.db.transaction([STORE_ANGGOTA], "readwrite");
    const store = transaction.objectStore(STORE_ANGGOTA);
    return new Promise((resolve, reject) => {
      const request = store.put({ id, nama });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAnggota(id) {
    const transaction = this.db.transaction([STORE_ANGGOTA], "readwrite");
    const store = transaction.objectStore(STORE_ANGGOTA);
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllAnggota() {
    const transaction = this.db.transaction([STORE_ANGGOTA], "readwrite");
    const store = transaction.objectStore(STORE_ANGGOTA);
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // KELOMPOK OPERATIONS

  async saveKelompok(kelompokData) {
    // Clear previous kelompok data first (only keep latest)
    await this.clearAllKelompok();

    const transaction = this.db.transaction([STORE_KELOMPOK], "readwrite");
    const store = transaction.objectStore(STORE_KELOMPOK);
    return new Promise((resolve, reject) => {
      const request = store.add({
        data: kelompokData,
        timestamp: new Date(),
      });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getLatestKelompok() {
    const transaction = this.db.transaction([STORE_KELOMPOK], "readonly");
    const store = transaction.objectStore(STORE_KELOMPOK);
    const index = store.index("timestamp");

    return new Promise((resolve, reject) => {
      const request = index.openCursor(null, "prev");
      request.onsuccess = () => {
        const cursor = request.result;
        resolve(cursor ? cursor.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllKelompok() {
    const transaction = this.db.transaction([STORE_KELOMPOK], "readonly");
    const store = transaction.objectStore(STORE_KELOMPOK);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllKelompok() {
    const transaction = this.db.transaction([STORE_KELOMPOK], "readwrite");
    const store = transaction.objectStore(STORE_KELOMPOK);
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export default Database;
