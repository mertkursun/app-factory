import { getProfile, createProfile, updateProfile } from "@/services/profile";

const mockSingle = jest.fn();
const mockSelect = jest.fn(() => ({ single: mockSingle }));
const mockInsert = jest.fn(() => ({ select: mockSelect }));
const mockUpdateEqSelect = jest.fn(() => ({ single: mockSingle }));
const mockUpdateEq = jest.fn(() => ({ select: mockUpdateEqSelect }));
const mockUpdate = jest.fn(() => ({ eq: mockUpdateEq }));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: mockSingle,
        })),
      })),
      insert: mockInsert,
      update: mockUpdate,
    })),
  },
}));

const mockProfile = {
  id: "profile-1",
  user_id: "user-1",
  audiences: ["bebek"],
  display_name: "Test Kullanıcı",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getProfile", () => {
  it("returns profile when found", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

    const result = await getProfile("user-1");
    expect(result).toEqual(mockProfile);
  });

  it("returns null when no profile found (PGRST116)", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116", message: "No rows found" },
    });

    const result = await getProfile("user-1");
    expect(result).toBeNull();
  });

  it("throws on unexpected error", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "42P01", message: "Table not found" },
    });

    await expect(getProfile("user-1")).rejects.toEqual({
      code: "42P01",
      message: "Table not found",
    });
  });
});

describe("createProfile", () => {
  it("returns created profile", async () => {
    mockSingle.mockResolvedValueOnce({ data: mockProfile, error: null });

    const result = await createProfile({
      user_id: "user-1",
      audiences: ["bebek"],
      display_name: "Test Kullanıcı",
    });

    expect(result).toEqual(mockProfile);
  });

  it("throws on error", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "23505", message: "Duplicate key" },
    });

    await expect(
      createProfile({
        user_id: "user-1",
        audiences: [],
      }),
    ).rejects.toEqual({ code: "23505", message: "Duplicate key" });
  });
});

describe("updateProfile", () => {
  it("returns updated profile", async () => {
    const updatedProfile = { ...mockProfile, display_name: "Yeni Ad" };
    mockSingle.mockResolvedValueOnce({ data: updatedProfile, error: null });

    const result = await updateProfile("user-1", {
      display_name: "Yeni Ad",
    });

    expect(result).toEqual(updatedProfile);
  });

  it("throws on error", async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { code: "42501", message: "Permission denied" },
    });

    await expect(updateProfile("user-1", { display_name: "Test" })).rejects.toEqual({
      code: "42501",
      message: "Permission denied",
    });
  });
});
