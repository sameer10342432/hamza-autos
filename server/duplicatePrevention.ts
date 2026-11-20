/**
 * Hamza Autos - Server-Side Image Duplicate Prevention System
 * Performs multi-layer duplicate checking:
 * 1. Exact SHA-256 byte comparison
 * 2. Perceptual Difference Hash (dHash) via Sharp (detects resizes, compressions, and visual clones)
 * 3. Registered website section assignment validation
 */

import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export interface ImageRegistryRecord {
  id: string;
  route: string;
  section: string;
  fileRel: string;
  publicUrl: string;
  dhash: string;
  sha256: string;
  desc: string;
}

// Load or build inventory of registered website images
let cachedInventory: ImageRegistryRecord[] = [];

export function loadCentralInventory(): ImageRegistryRecord[] {
  if (cachedInventory.length > 0) return cachedInventory;
  const invPath = path.resolve(process.cwd(), 'scripts', 'central_inventory.json');
  if (fs.existsSync(invPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(invPath, 'utf-8'));
      cachedInventory = data.map((d: any) => ({
        id: d.id,
        route: d.route,
        section: d.section,
        fileRel: d.file_rel,
        publicUrl: `/assets/images/${d.file_rel}`,
        dhash: d.dhash,
        sha256: d.sha256,
        desc: d.desc
      }));
      return cachedInventory;
    } catch (e) {
      console.error('[DuplicatePrevention] Error loading central_inventory.json:', e);
    }
  }
  return [];
}

export function hammingDistance(h1: string, h2: string): number {
  if (!h1 || !h2) return 64;
  try {
    const v1 = BigInt('0x' + h1);
    const v2 = BigInt('0x' + h2);
    let xor = v1 ^ v2;
    let count = 0;
    while (xor > 0n) {
      if (xor & 1n) count++;
      xor >>= 1n;
    }
    return count;
  } catch {
    return 64;
  }
}

export async function computePerceptualHash(buffer: Buffer): Promise<string> {
  try {
    const { data } = await sharp(buffer)
      .resize(9, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let bits = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const left = data[row * 9 + col];
        const right = data[row * 9 + col + 1];
        bits += (left > right ? '1' : '0');
      }
    }
    return BigInt('0b' + bits).toString(16).padStart(16, '0');
  } catch (err) {
    console.warn('[DuplicatePrevention] Could not compute dHash:', err);
    return '';
  }
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchType: 'exact' | 'perceptual' | 'registered_url' | 'none';
  matchedRecord?: ImageRegistryRecord;
  distance?: number;
  message: string;
}

export async function checkImageBufferForDuplicates(
  buffer: Buffer, 
  filename?: string
): Promise<DuplicateCheckResult> {
  const inventory = loadCentralInventory();
  const fileSha = crypto.createHash('sha256').update(buffer).digest('hex');
  const fileDHash = await computePerceptualHash(buffer);

  // 1. Exact SHA-256 match against central inventory
  for (const item of inventory) {
    if (item.sha256 === fileSha || fileSha.startsWith(item.sha256)) {
      return {
        isDuplicate: true,
        matchType: 'exact',
        matchedRecord: item,
        distance: 0,
        message: `Exact duplicate detected! This file is identical to the photograph exclusively assigned to "${item.section}" (${item.route}).`
      };
    }
  }

  // 2. Perceptual visual similarity check (dHash <= 8 bits difference)
  if (fileDHash) {
    let closestItem: ImageRegistryRecord | null = null;
    let minDistance = 64;

    for (const item of inventory) {
      if (item.dhash) {
        const dist = hammingDistance(fileDHash, item.dhash);
        if (dist < minDistance) {
          minDistance = dist;
          closestItem = item;
        }
      }
    }

    if (minDistance <= 8 && closestItem) {
      return {
        isDuplicate: true,
        matchType: 'perceptual',
        matchedRecord: closestItem,
        distance: minDistance,
        message: `Visually identical photograph detected (${minDistance} bits difference)! This image is already used in "${closestItem.section}" (${closestItem.route}). Please choose a genuinely different photograph.`
      };
    }
  }

  return {
    isDuplicate: false,
    matchType: 'none',
    message: 'Image is unique. No duplicates found across public website pages.'
  };
}

export function checkImageUrlForAssignment(url: string): DuplicateCheckResult {
  const inventory = loadCentralInventory();
  const clean = url.replace(/^\.?\/?(hamza-autos\/)?/, '').replace(/^\/?assets\/images\//, '');

  const matched = inventory.find(i => 
    i.fileRel === clean || 
    i.publicUrl.endsWith(clean) || 
    url.includes(i.fileRel)
  );

  if (matched) {
    return {
      isDuplicate: true,
      matchType: 'registered_url',
      matchedRecord: matched,
      message: `Image already in use! This image is exclusively assigned to "${matched.section}" (${matched.route}).`
    };
  }

  return {
    isDuplicate: false,
    matchType: 'none',
    message: 'Image URL is unique.'
  };
}
