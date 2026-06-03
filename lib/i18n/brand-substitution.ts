export interface BrandI18nParams {
  brand: string;
  brandShort: string;
  product: string;
}

/** Replace `{{brand}}`, `{{brandShort}}`, and `{{product}}` in a loaded message tree. */
export function substituteBrandInMessages(value: unknown, params: BrandI18nParams): unknown {
  if (typeof value === "string") {
    return value
      .replace(/\{\{brand\}\}/g, params.brand)
      .replace(/\{\{brandShort\}\}/g, params.brandShort)
      .replace(/\{\{product\}\}/g, params.product);
  }
  if (value && typeof value === "object") {
    const node = value as Record<string, unknown>;
    for (const key of Object.keys(node)) {
      node[key] = substituteBrandInMessages(node[key], params);
    }
  }
  return value;
}
