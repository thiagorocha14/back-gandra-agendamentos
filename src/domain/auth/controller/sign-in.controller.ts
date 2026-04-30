import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthSessionResponse } from '../service/auth-payload';
import { SignInService } from '../service/sign-in.service';

@Controller('auth')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto): Promise<AuthSessionResponse> {
    return this.signInService.execute(dto);
  }
}
