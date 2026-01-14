import { Module } from '@nestjs/common';
import { ChatModule } from './order-placement/order.module';

@Module({
  imports: [ChatModule],
})
export class AppModule { }
