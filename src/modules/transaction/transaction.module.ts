import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PaymentModule } from '@/modules/payment';
import { HttpModule } from '@/modules/http';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), PaymentModule, HttpModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
