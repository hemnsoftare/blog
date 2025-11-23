export type User = {
  id: string;
  email: string;
  name?: string;
  roles?: string[];
  // add other profile fields as needed
};

export type Credentials = {
  email: string;
  password: string;
  remember?: boolean;
};

export type AuthToken = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // epoch ms
};

export type AuthState = {
  user: User | null;
  tokens: AuthToken | null;
  loading: boolean;
  error?: string | null;
};

export type AuthContextValue = {
  state: AuthState;
  login: (creds: Credentials) => Promise<void>;
  logout: () => void;
  refresh?: () => Promise<void>;
};
