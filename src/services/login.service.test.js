import { renderHook } from "@testing-library/react-hooks";
import { ueLogin } from "./login.service";

jest.mock("./login.service", () => ({
  useLogin: jest.fn(() => ({
    loginWithGooglePopup: jest.fn(),
    user: null,
    loading: false,
  })),
}));

describe("login service", () => {
  it("loginWithGooglePopup returns user data", async () => {
    const mockResult = { user: { name: "John Doe" } };
    useLogin().loginWithGooglePopup.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useLogin());
    await result.current.loginWithGooglePopup();
    expect(result.current.user).toEqual(mockResult.user);
  });

  it("useLogin hook returns correct values", () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
describe("login service", () => {
  it("loginWithGooglePopup returns user data", () => {
    useLogin()
      .loginWithGooglePopup()
      .then((result) => {
        expect(result).toHaveProperty("user");
      });
  });
  it("useLogin hook returns correct values", () => {
    const { user, loading } = useLogin();
    expect(user).toBeNull();
    expect(loading).toBe(false);
  });
});
