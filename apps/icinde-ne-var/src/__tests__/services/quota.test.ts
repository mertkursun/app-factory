import { getQuotaInfo } from "@/services/quota";
import { FREE_MONTHLY_QUOTA } from "@/lib/constants";

const mockKullanimSingle = jest.fn();
const mockAbonelikSingle = jest.fn();

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn((table: string) => {
      if (table === "kullanim") {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: mockKullanimSingle,
              })),
            })),
          })),
        };
      }
      if (table === "abonelikler") {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: mockAbonelikSingle,
            })),
          })),
        };
      }
      return {};
    }),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getQuotaInfo", () => {
  it("returns correct quota for free user with no usage", async () => {
    mockKullanimSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116" },
    });
    mockAbonelikSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116" },
    });

    const result = await getQuotaInfo("user-1");

    expect(result.used).toBe(0);
    expect(result.isPro).toBe(false);
    expect(result.limit).toBe(FREE_MONTHLY_QUOTA);
    expect(result.remaining).toBe(FREE_MONTHLY_QUOTA);
  });

  it("returns correct quota for free user with partial usage", async () => {
    mockKullanimSingle.mockResolvedValueOnce({
      data: { sorgu_sayisi: 3 },
      error: null,
    });
    mockAbonelikSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116" },
    });

    const result = await getQuotaInfo("user-1");

    expect(result.used).toBe(3);
    expect(result.isPro).toBe(false);
    expect(result.remaining).toBe(FREE_MONTHLY_QUOTA - 3);
  });

  it("returns correct quota for free user with exhausted quota", async () => {
    mockKullanimSingle.mockResolvedValueOnce({
      data: { sorgu_sayisi: FREE_MONTHLY_QUOTA + 1 },
      error: null,
    });
    mockAbonelikSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116" },
    });

    const result = await getQuotaInfo("user-1");

    expect(result.used).toBe(FREE_MONTHLY_QUOTA + 1);
    expect(result.remaining).toBe(0);
  });

  it("returns Infinity for active Pro user", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    mockKullanimSingle.mockResolvedValueOnce({
      data: { sorgu_sayisi: 100 },
      error: null,
    });
    mockAbonelikSingle.mockResolvedValueOnce({
      data: { durum: "aktif", bitis: futureDate.toISOString() },
      error: null,
    });

    const result = await getQuotaInfo("user-1");

    expect(result.isPro).toBe(true);
    expect(result.limit).toBe(Infinity);
    expect(result.remaining).toBe(Infinity);
  });

  it("treats expired Pro as free user", async () => {
    const pastDate = new Date("2020-01-01");

    mockKullanimSingle.mockResolvedValueOnce({
      data: { sorgu_sayisi: 2 },
      error: null,
    });
    mockAbonelikSingle.mockResolvedValueOnce({
      data: { durum: "aktif", bitis: pastDate.toISOString() },
      error: null,
    });

    const result = await getQuotaInfo("user-1");

    expect(result.isPro).toBe(false);
    expect(result.remaining).toBe(FREE_MONTHLY_QUOTA - 2);
  });
});
