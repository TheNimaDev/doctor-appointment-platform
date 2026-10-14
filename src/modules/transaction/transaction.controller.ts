import { Body, Controller, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@/types';
import * as TransactionDecorator from './decorators';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
  ) {}

  @TransactionDecorator.CreateTransactionDecorators()
  @Post('payment/:paymentId')
  async create(@Param('paymentId') paymentId: string, @Body() dto: CreateTransactionDto): Promise<ApiResponse> {
    const { transaction } = await this.transactionService.createTransaction({
      paymentId,
      ...dto,
    });

    const paymentUrl = new URL(
      `/start/${transaction.trackId}`,
      this.configService.getOrThrow<string>('ZIBAL_URL'),
    ).toString();

    return {
      message: paymentUrl,
    };
  }
}
