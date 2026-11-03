import type { Session, User } from "@supabase/supabase-js";

jest.mock("@/lib/supabase", () => {
  const mockUnsubscribe = jest.fn();
  return {
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: mockUnsubscribe } },
        }),
        signInWithOtp: jest.fn(),
        verifyOtp: jest.fn(),
        signOut: jest.fn(),
      },
    },
  };
});

// eslint-disable-next-line import/first, @typescript-eslint/no-require-imports
const { supabase } = require("@/lib/supabase") as {
  supabase: {
    auth: {
      getSession: jest.Mock;
      onAuthStateChange: jest.Mock;
    };
  };
};
// eslint-disable-next-line import/first
import { useAuthStore } from "@/stores/authStore";

const createMockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: "user-123",
    email: "test@example.com",
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
    ...overrides,
  }) as User;

const createMockSession = (overrides: Partial<Session> = {}): Session =>
  ({
    access_token: "access-token",
    refresh_token: "refresh-token",
    expires_in: 3600,
    token_type: "bearer",
    user: createMockUser(),
    ...overrides,
  }) as Session;

function getMockUnsubscribe(): jest.Mock {
  const returnValue = supabase.auth.onAuthStateChange.mock.results[0]?.value as {
    data: { subscription: { unsubscribe: jest.Mock } };
  };
  return returnValue.data.subscription.unsubscribe;
}

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: null,
      user: null,
      isLoading: true,
      isInitialized: false,
    });
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    const state = useAuthStore.getState();

    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(true);
    expect(state.isInitialized).toBe(false);
  });

  it("sets session and user when setSession is called with a session", () => {
    const mockSession = createMockSession();

    useAuthStore.getState().setSession(mockSession);

    const state = useAuthStore.getState();
    expect(state.session).toBe(mockSession);
    expect(state.user).toBe(mockSession.user);
    expect(state.isLoading).toBe(false);
  });

  it("clears session and user when setSession is called with null", () => {
    const mockSession = createMockSession();
    useAuthStore.getState().setSession(mockSession);

    useAuthStore.getState().setSession(null);

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("returns cleanup function from initialize", () => {
    const cleanup = useAuthStore.getState().initialize();

    expect(typeof cleanup).toBe("function");
    cleanup();
    expect(getMockUnsubscribe()).toHaveBeenCalledTimes(1);
  });

  it("sets isInitialized to true after initialize resolves", async () => {
    useAuthStore.getState().initialize();

    await new Promise(process.nextTick);

    const state = useAuthStore.getState();
    expect(state.isInitialized).toBe(true);
    expect(state.isLoading).toBe(false);
  });
});
