const auth = "auth";
export const dkp = "dkp";

export const paths = {
  login: (returnTo?: string): string => {
    const base = `/${auth}/login`;
    return returnTo ? encodeURI(`${base}?returnTo=${returnTo}`) : base;
  },
  loginCallback: (): string => {
    return `/${auth}/callback`;
  },
  loginFailure: (): string => {
    return `/${auth}/error`;
  },
  logout: (): string => {
    return `/${auth}/logout`;
  },
  dashboard: (): string => {
    return `/${dkp}/dashboard`;
  },
  userSettings: (): string => {
    return `/${dkp}/user/settings`;
  },
};
