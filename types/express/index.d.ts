// types/express/index.d.ts
import type { SessionUser } from "../../server/types";

declare global {
  namespace Express {
    interface User extends SessionUser {}
    interface Request {
      user?: SessionUser;
    }
  }
}
