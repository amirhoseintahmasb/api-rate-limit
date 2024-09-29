import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { LoggerModule } from './core/logger/logger.module';
import { ErrorHandlerModule } from './shared/error_handler/error_handler.module';
import { ApiModule } from './modules/api/api.module';

@Module({
  imports: [UserModule, LoggerModule, ErrorHandlerModule, ApiModule],
})
export class AppModule {}
