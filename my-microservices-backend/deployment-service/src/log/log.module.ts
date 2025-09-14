import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogsController } from './log.controller';


@Module({
  controllers: [LogsController],
  providers: [LogService],
})
export class LogModule {}
