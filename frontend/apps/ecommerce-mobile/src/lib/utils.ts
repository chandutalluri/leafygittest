/**
 * Utility functions for LeafyHealth Platform
 */

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Legacy support for existing code
export function formatCurrency(amount: number): string {
  return formatPrice(amount);
}

export function formatWeight(weight: number, unit: string): string {
  return `${weight}${unit}`;
}

export function calculateGST(amount: number, rate: number = 18): number {
  return Math.round((amount * rate) / 100);
}

export function calculateTotal(subtotal: number, gstRate: number = 18): number {
  const gst = calculateGST(subtotal, gstRate);
  return subtotal + gst;
}

export function getDeliveryCharge(pincode: string, amount: number): number {
  // Free delivery for orders above ₹500
  if (amount >= 500) return 0;

  // Metro cities: ₹40, Others: ₹60
  const metroPincodes = ['110', '400', '560', '600', '700', '500'];
  const isMetro = metroPincodes.some(code => pincode.startsWith(code));

  return isMetro ? 40 : 60;
}

export function validatePincode(pincode: string): boolean {
  // Indian pincode format: 6 digits
  return /^[1-9][0-9]{5}$/.test(pincode);
}
