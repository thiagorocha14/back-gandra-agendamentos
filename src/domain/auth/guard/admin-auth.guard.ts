import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

export type JwtAuthUser = {
  id: string;
  email: string;
  userType: string;
};

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard {
  handleRequest<TUser = JwtAuthUser>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    const authenticated = super.handleRequest(err, user, info, context, status);
    const u = authenticated as JwtAuthUser;
    if (u.userType !== 'admin') {
      throw new ForbiddenException('Acesso restrito a administradores.');
    }
    return authenticated;
  }
}
