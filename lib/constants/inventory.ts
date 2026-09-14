export const LOW_STOCK_THRESHOLD = 10;

export type InventoryStatusType = 'IN STOCK' | 'LOW STOCK' | 'CRITICAL OUT' | 'OUT OF STOCK';

export function getInventoryStatus(
  quantity: number,
  reorderLevel: number = LOW_STOCK_THRESHOLD
): InventoryStatusType {
  if (quantity <= 0) {
    return 'CRITICAL OUT';
  }
  if (quantity <= reorderLevel) {
    return 'LOW STOCK';
  }
  return 'IN STOCK';
}

export function isAvailableInStock(quantity: number): boolean {
  return quantity > 0;
}
