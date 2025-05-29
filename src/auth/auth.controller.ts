import { Controller, Post, Body } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const user = await this.authService.findByEmail(loginAuthDto.email);
    if (!user) {
      return { message: 'Email ou senha inválidos' };
    }
    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      return { message: 'Email ou senha inválidos' };
    }
    // Gere o JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    const { ...result } = user;
    return {
      token,
      ...result,
    };
  }
}
