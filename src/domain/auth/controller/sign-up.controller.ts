import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthSessionResponse } from '../service/auth-payload';
import { SignUpService } from '../service/sign-up.service';

@Controller('auth')
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto): Promise<AuthSessionResponse> {
    return this.signUpService.execute(dto);
  }
}
