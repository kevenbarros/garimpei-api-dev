import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SUA_CHAVE_SECRETA', // Troque por uma variável de ambiente em produção
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
