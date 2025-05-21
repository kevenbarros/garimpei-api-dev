import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 6000,
      username: 'postgres',
      password: 'root',
      database: 'garimpeidb',
      entities: [
        // Task
      ],
      synchronize: true, // true só para desenvolvimento!
    }),
    // TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
