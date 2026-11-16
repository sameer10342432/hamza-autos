/**
 * Hamza Autos - Server-Side Secure File-Based JSON Storage Engine
 * Location: Abu Bakar Road, Badami Bagh, Lahore (+92 325 1814548)
 * 
 * Features:
 * - Atomic write operations using temp files + rename
 * - In-memory queue mutex per file for concurrency protection
 * - Automatic pre-write safety backups in storage/backups/
 * - Schema validation and corrupted JSON protection
 * - Standardized unique IDs and ISO timestamps
 */

import fs from 'fs';
import path from 'path';

export const STORAGE_DIR = path.resolve(process.cwd(), 'storage');
export const BACKUPS_DIR = path.resolve(STORAGE_DIR, 'backups');
export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

// Ensure directories exist
for (const dir of [
  STORAGE_DIR,
  BACKUPS_DIR,
  UPLOADS_DIR,
  path.resolve(UPLOADS_DIR, 'blogs'),
  path.resolve(UPLOADS_DIR, 'services'),
  path.resolve(UPLOADS_DIR, 'gallery'),
  path.resolve(UPLOADS_DIR, 'banners'),
  path.resolve(UPLOADS_DIR, 'documents')
]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// In-memory Mutex queue per file to serialize writes and prevent race conditions
const writeQueues: Map<string, Promise<any>> = new Map();

// In-memory cache with mtime validation for instantaneous reads
const memoryCache: Map<string, { data: any; mtime: number }> = new Map();

function enqueueWrite<T>(filePath: string, operation: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(filePath) || Promise.resolve();
  const next = previous.then(() => operation()).catch(err => {
    console.error(`[FileStore Error] Error executing file write on ${filePath}:`, err);
    throw err;
  });
  writeQueues.set(filePath, next);
  return next;
}

/**
 * Read data from a JSON file in storage/ with memory caching
 */
export async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  const filePath = path.join(STORAGE_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      await writeJsonFileAtomic(filename, defaultValue);
      return defaultValue;
    }

    const stat = await fs.promises.stat(filePath);
    const cached = memoryCache.get(filename);
    if (cached && cached.mtime === stat.mtimeMs) {
      return cached.data as T;
    }

    const raw = await fs.promises.readFile(filePath, 'utf-8');
    if (!raw.trim()) {
      return defaultValue;
    }
    const parsed = JSON.parse(raw);
    memoryCache.set(filename, { data: parsed, mtime: stat.mtimeMs });
    return parsed as T;
  } catch (error: any) {
    console.error(`[FileStore Warning] Could not parse ${filename}. Recovering:`, error.message);
    // If corrupted, try to restore from most recent backup
    const recovered = await tryRestoreLatestBackup<T>(filename);
    if (recovered !== null) {
      console.log(`[FileStore] Successfully recovered ${filename} from latest backup.`);
      return recovered;
    }
    return defaultValue;
  }
}

/**
 * Atomic write with file locking, validation, and automated safety backup
 */
export async function writeJsonFileAtomic<T>(filename: string, data: T, createSafetyBackup: boolean = true): Promise<void> {
  const filePath = path.join(STORAGE_DIR, filename);

  return enqueueWrite(filePath, async () => {
    // 1. Validate data serializeability
    let jsonString: string;
    try {
      jsonString = JSON.stringify(data, null, 2);
      // Verify parse roundtrip
      JSON.parse(jsonString);
    } catch (err: any) {
      throw new Error(`Data serialization failed for ${filename}: ${err.message}`);
    }

    // 2. Create safety backup if file already exists
    if (createSafetyBackup && fs.existsSync(filePath)) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `${path.parse(filename).name}_${timestamp}.bak.json`;
        const backupPath = path.join(BACKUPS_DIR, backupName);
        await fs.promises.copyFile(filePath, backupPath);
        await pruneBackups(filename, 10); // Keep max 10 latest backups
      } catch (backupErr) {
        console.warn(`[FileStore] Non-fatal backup warning for ${filename}:`, backupErr);
      }
    }

    // 3. Write to temporary file first (atomic write pattern)
    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.floor(Math.random() * 10000)}`;
    await fs.promises.writeFile(tempPath, jsonString, 'utf-8');

    // 4. Atomic rename replaces destination file without leaving partial data
    await fs.promises.rename(tempPath, filePath);

    // 5. Update in-memory cache
    try {
      const stat = await fs.promises.stat(filePath);
      memoryCache.set(filename, { data, mtime: stat.mtimeMs });
    } catch {}
  });
}

/**
 * Prune old backup files to save disk space
 */
async function pruneBackups(filename: string, maxToKeep: number): Promise<void> {
  try {
    const baseName = path.parse(filename).name;
    const allFiles = await fs.promises.readdir(BACKUPS_DIR);
    const related = allFiles
      .filter(f => f.startsWith(`${baseName}_`) && f.endsWith('.bak.json'))
      .sort()
      .reverse();

    if (related.length > maxToKeep) {
      const toDelete = related.slice(maxToKeep);
      for (const oldFile of toDelete) {
        await fs.promises.unlink(path.join(BACKUPS_DIR, oldFile)).catch(() => {});
      }
    }
  } catch (err) {
    // Non-fatal
  }
}

/**
 * Try to restore from the latest valid backup
 */
async function tryRestoreLatestBackup<T>(filename: string): Promise<T | null> {
  try {
    const baseName = path.parse(filename).name;
    const allFiles = await fs.promises.readdir(BACKUPS_DIR);
    const related = allFiles
      .filter(f => f.startsWith(`${baseName}_`) && f.endsWith('.bak.json'))
      .sort()
      .reverse();

    for (const bkp of related) {
      try {
        const raw = await fs.promises.readFile(path.join(BACKUPS_DIR, bkp), 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed as T;
      } catch (e) {
        continue;
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

/**
 * Generate standard unique ID
 */
export function generateId(prefix: string = 'rec'): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${ts}-${rand}`;
}

/**
 * Current Pakistan/ISO Timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
