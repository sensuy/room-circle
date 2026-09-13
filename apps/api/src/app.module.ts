import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { OwnersModule } from './owners.js';

@Module({
  imports: [OwnersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
