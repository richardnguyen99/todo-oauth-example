import { chain } from "./middlewares/chain";
import { withInitializeResponse } from "./middlewares/initial-response";
import { withAuth } from "./middlewares/with-auth";
import { withSearchParams } from "./middlewares/with-search-params";

export default chain([withInitializeResponse, withSearchParams, withAuth]);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/dashboard/:path*"],
};
