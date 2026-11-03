---
name: open-food-facts-api
description: Open Food Facts v3 universal API for barcode lookups across food, beauty, pet food, and general products
metadata:
  type: reference
---

Open Food Facts provides a free, no-key-required API for barcode product lookups.

- **Universal endpoint:** `GET https://world.openfoodfacts.org/api/v3/product/{barcode}?product_type=all` returns results from any of the four databases (food, beauty, pet food, products).
- **User-Agent required:** Requests without a proper User-Agent header may be rate-limited.
- **No API key needed:** The API is public and anonymous.

**How to apply:** Use the v3 endpoint with `product_type=all` for apps that scan mixed product types. Always include a descriptive User-Agent header.
