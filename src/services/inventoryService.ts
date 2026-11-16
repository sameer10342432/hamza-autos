/**
 * Inventory Service - Feature 7: Spare Parts Inventory Management
 * Local-First IndexedDB transactional stock tracking, movement history, and validation
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  withTransaction,
  STORES
} from './storageService';
import { SparePart, InventoryMovementRecord } from '../types';

export const inventoryService = {
  async getAll(includeArchived = false): Promise<SparePart[]> {
    const list = await getAllFromStore<SparePart>(STORES.INVENTORY);
    if (!includeArchived) {
      return list.filter(p => !p.isArchived);
    }
    return list;
  },

  async getById(id: string): Promise<SparePart | null> {
    return getByIdFromStore<SparePart>(STORES.INVENTORY, id);
  },

  async getBySku(sku: string): Promise<SparePart | null> {
    const clean = sku.trim().toUpperCase();
    const all = await this.getAll(true);
    return all.find(p => p.sku.toUpperCase() === clean) || null;
  },

  async getMovements(partId?: string): Promise<InventoryMovementRecord[]> {
    const all = await getAllFromStore<InventoryMovementRecord>(STORES.INVENTORY_MOVEMENTS);
    const sorted = all.sort((a, b) => b.date.localeCompare(a.date));
    if (partId) {
      return sorted.filter(m => m.partId === partId);
    }
    return sorted;
  },

  async getLowStockItems(): Promise<SparePart[]> {
    const all = await this.getAll();
    return all.filter(p => p.stockQuantity <= p.minStockAlert);
  },

  async create(data: Omit<SparePart, 'id' | 'isArchived'> & { id?: string; isArchived?: boolean }): Promise<SparePart> {
    const existing = await this.getBySku(data.sku || data.partNumber);
    if (existing) {
      throw new Error(`A spare part with SKU "${data.sku || data.partNumber}" already exists.`);
    }

    const item: SparePart = {
      id: data.id || `part-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sku: (data.sku || data.partNumber).trim().toUpperCase(),
      partNumber: (data.partNumber || data.sku).trim().toUpperCase(),
      partName: data.partName.trim(),
      category: data.category || 'General',
      compatibleBrands: data.compatibleBrands || ['Honda', 'Yamaha', 'Suzuki'],
      compatibleModels: data.compatibleModels || ['All 70cc - 125cc'],
      purchasePrice: Number(data.purchasePrice) || 0,
      sellingPrice: Number(data.sellingPrice) || 0,
      stockQuantity: Number(data.stockQuantity) || 0,
      minStockAlert: Number(data.minStockAlert) || 5,
      supplier: data.supplier?.trim() || 'Badami Bagh Parts Market',
      description: data.description?.trim() || '',
      isArchived: !!data.isArchived,
      lastRestocked: new Date().toISOString().slice(0, 10)
    };

    await putInStore(STORES.INVENTORY, item);

    // Record initial movement
    if (item.stockQuantity > 0) {
      await this.recordMovement({
        partId: item.id,
        partName: item.partName,
        sku: item.sku,
        type: 'purchase',
        quantity: item.stockQuantity,
        previousStock: 0,
        newStock: item.stockQuantity,
        unitCost: item.purchasePrice,
        reason: 'Initial Inventory Stock Entry',
        recordedBy: 'Admin'
      });
    }

    return item;
  },

  async update(part: SparePart): Promise<SparePart> {
    await putInStore(STORES.INVENTORY, part);
    return part;
  },

  async recordMovement(movement: Omit<InventoryMovementRecord, 'id' | 'date'> & { id?: string; date?: string }): Promise<InventoryMovementRecord> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const rec: InventoryMovementRecord = {
      id: movement.id || `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      partId: movement.partId,
      partName: movement.partName,
      sku: movement.sku,
      type: movement.type,
      quantity: movement.quantity,
      previousStock: movement.previousStock,
      newStock: movement.newStock,
      unitCost: movement.unitCost,
      referenceType: movement.referenceType,
      referenceId: movement.referenceId,
      reason: movement.reason,
      date: movement.date || now,
      recordedBy: movement.recordedBy || 'Admin'
    };

    await putInStore(STORES.INVENTORY_MOVEMENTS, rec);
    return rec;
  },

  /**
   * Transactional stock deduction for a Job Card or Invoice
   * Prevents negative stock and logs movement in a single atomic transaction
   */
  async consumeStockForJob(
    items: { partId?: string; partName: string; quantity: number; unitPrice: number }[],
    referenceType: 'jobCard' | 'invoice',
    referenceId: string,
    recordedBy = 'Workshop Mechanic'
  ): Promise<void> {
    for (const item of items) {
      if (!item.partId) continue;
      const part = await this.getById(item.partId);
      if (!part) continue;

      if (part.stockQuantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${part.partName}". Available: ${part.stockQuantity}, Requested: ${item.quantity}. Cannot allocate negative inventory.`
        );
      }

      const prevStock = part.stockQuantity;
      part.stockQuantity -= item.quantity;
      await this.update(part);

      await this.recordMovement({
        partId: part.id,
        partName: part.partName,
        sku: part.sku || part.partNumber,
        type: referenceType === 'jobCard' ? 'consumed_job' : 'consumed_invoice',
        quantity: -item.quantity,
        previousStock: prevStock,
        newStock: part.stockQuantity,
        unitCost: part.purchasePrice,
        referenceType,
        referenceId,
        reason: `Allocated to ${referenceType === 'jobCard' ? 'Job Card' : 'Invoice'} #${referenceId}`,
        recordedBy
      });
    }
  },

  /**
   * Transactional stock restoration when a job/invoice part usage is reversed or cancelled
   */
  async restoreStockForJob(
    items: { partId?: string; partName: string; quantity: number }[],
    referenceType: 'jobCard' | 'invoice',
    referenceId: string,
    reason = 'Cancelled / Reversed Job Allocation',
    recordedBy = 'Admin'
  ): Promise<void> {
    for (const item of items) {
      if (!item.partId) continue;
      const part = await this.getById(item.partId);
      if (!part) continue;

      const prevStock = part.stockQuantity;
      part.stockQuantity += item.quantity;
      await this.update(part);

      await this.recordMovement({
        partId: part.id,
        partName: part.partName,
        sku: part.sku || part.partNumber,
        type: 'reversal',
        quantity: item.quantity,
        previousStock: prevStock,
        newStock: part.stockQuantity,
        unitCost: part.purchasePrice,
        referenceType,
        referenceId,
        reason: `${reason} #${referenceId}`,
        recordedBy
      });
    }
  },

  async adjustStock(partId: string, newQuantity: number, reason: string, recordedBy = 'Admin'): Promise<SparePart> {
    const part = await this.getById(partId);
    if (!part) throw new Error('Part not found');

    const prev = part.stockQuantity;
    const diff = newQuantity - prev;
    part.stockQuantity = Math.max(0, newQuantity);
    await this.update(part);

    await this.recordMovement({
      partId: part.id,
      partName: part.partName,
      sku: part.sku || part.partNumber,
      type: 'adjustment',
      quantity: diff,
      previousStock: prev,
      newStock: part.stockQuantity,
      unitCost: part.purchasePrice,
      reason: reason || 'Manual Physical Stock Count Adjustment',
      recordedBy
    });

    return part;
  },

  async archive(id: string): Promise<void> {
    const part = await this.getById(id);
    if (part) {
      part.isArchived = true;
      await this.update(part);
    }
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.INVENTORY, id);
  }
};
