import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { DatabaseService } from '@/modules/database/database.service';
import { User } from '@/modules/user/entities';
import { AuthUserResponse } from '@/types';
import { checkDatabaseError, getSafeUser } from '@/lib';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async register(params: RegisterDto): Promise<AuthUserResponse> {
    const result = await this.databaseService.dataSource.transaction(async (manager) => {
      const hashedPassword = await bcrypt.hash(params.password, 10);

      try {
        const user = manager.create(User, {
          ...params,
          password: hashedPassword,
        });

        await manager.save(user);

        const { user: userData } = getSafeUser(user);

        return {
          user: userData,
        };
      } catch (error) {
        checkDatabaseError({
          e: error as Error,
          mainResource: 'User',
          conflictField: 'email',
        });
      }
    });

    return result;
  }
}
