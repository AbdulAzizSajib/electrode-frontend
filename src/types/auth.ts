/**
 * Auth types mirroring the backend's `/auth/*` responses
 * (electrode-server: src/app/module/auth).
 *
 * This storefront is customer-only — the admin panel is a separate app — so
 * there is no role-based routing here. The role still arrives in the JWT
 * (`CUSTOMER` for anyone who signs up through this site) and is kept on the
 * type for completeness.
 */

export type UserRole = "OWNER" | "ADMIN" | "STAFF" | "CUSTOMER";

/** Shape of `data.user` returned by login / verify-email / me. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  contactNumber: string | null;
  isActive: boolean;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** `data` payload of a successful login / verify-email. */
export interface AuthData {
  /** better-auth session token — stored as the `better-auth.session_token` cookie. */
  token: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/** Claims the backend signs into the access token (see auth.service.ts). */
export interface AccessTokenClaims {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
  emailVerified: boolean;
  iat: number;
  exp: number;
}

/** Envelope every backend endpoint responds with (see shared/sendResponse.ts). */
export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  /** Present on paginated endpoints (e.g. `GET /products`). */
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

/**
 * Uniform result for every auth server action. Actions never throw across the
 * server/client boundary — they return this so the form can render the error.
 */
export type ActionResult<TExtra = object> =
  | ({ ok: true } & TExtra)
  | { ok: false; message: string };
