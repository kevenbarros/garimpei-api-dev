import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUA_CHAVE_SECRETA', // Use variável de ambiente em produção
    });
  }

  validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
