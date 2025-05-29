import { chain } from "./middlewares/chain";
import { withInitializeResponse } from "./middlewares/initial-response";
import { withAuth } from "./middlewares/with-auth";

export default chain([withInitializeResponse, withAuth]);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/dashboard/:path*"],
};
