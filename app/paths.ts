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
  dashboardCharacters: (): string => {
    return `${paths.dashboard()}/characters`;
  },
  dashboardAttendance: (): string => {
    return `${paths.dashboard()}/attendance`;
  },
  dashboardTransactions: (): string => {
    return `${paths.dashboard()}/transactions`;
  },
  activity: (): string => {
    return `/${dkp}/activity`;
  },
  activityRaids: (): string => {
    return `${paths.activity()}/raids`;
  },
  activityTransactions: (): string => {
    return `${paths.activity()}/transactions`;
  },
  userSettings: (): string => {
    return `/${dkp}/user/settings`;
  },
};
