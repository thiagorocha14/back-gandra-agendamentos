export type ParsedMercadoPagoExternalReference =
  | { kind: 'booking'; bookingId: string }
  | { kind: 'bundle_purchase'; purchaseIntentId: string };

export function buildBookingExternalReference(bookingId: string): string {
  return `booking:${bookingId}`;
}

export function buildBundlePurchaseExternalReference(
  purchaseIntentId: string,
): string {
  return `bundle_purchase:${purchaseIntentId}`;
}

export function parseMercadoPagoExternalReference(
  raw: string | undefined,
): ParsedMercadoPagoExternalReference | null {
  if (!raw || typeof raw !== 'string') {
    return null;
  }
  const decoded = decodeURIComponent(raw.trim());
  if (decoded.startsWith('booking:')) {
    const bookingId = decoded.slice('booking:'.length);
    if (bookingId.length > 0) {
      return { kind: 'booking', bookingId };
    }
  }
  if (decoded.startsWith('bundle_purchase:')) {
    const purchaseIntentId = decoded.slice('bundle_purchase:'.length);
    if (purchaseIntentId.length > 0) {
      return { kind: 'bundle_purchase', purchaseIntentId };
    }
  }
  return null;
}
