import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const request = context.switchToHttp().getRequest();
    console.log("JWT Guard", request.headers);

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      console.log("JWT Guard Error", err, user, _info);
      throw (
        err ||
        new UnauthorizedException({
          message: "Unauthorized Request",
          error: {
            ...err,
            ..._info,
          },
        })
      );
    }

    return user;
  }
}
