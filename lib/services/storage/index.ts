const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const LOGIN_KEY = 'isLoggedIn';
// const COMPANY_ID = 'companyId';

export const storage = {
  // setCompanyId: (id: string) => localStorage.setItem(COMPANY_ID, id),
  // getCompanyId: () => localStorage.getItem(COMPANY_ID),
  // removeCompanyId: () => localStorage.removeItem(COMPANY_ID),

  setLoginState: () => localStorage.setItem(LOGIN_KEY, 'true'),
  getLoginState: () => localStorage.getItem(LOGIN_KEY),
  removeLoginState: () => localStorage.removeItem(LOGIN_KEY),

  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  setUser: (user: unknown) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: <User>(): User | null => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user) as User;
    } catch {
      return null;
    }
  },
  removeUser: () => localStorage.removeItem(USER_KEY),

  clear: () => localStorage.clear(),
};
