import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { User } from '@/modules/user/entities';
import { AuthUserResponse, RegisterParams } from '@/types';
import { checkDatabaseError, getSafeUser, hashSecret } from '@/lib';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async register(params: RegisterParams): Promise<AuthUserResponse> {
    const result = await this.databaseService.dataSource.transaction(async (manager) => {
      const hashedPassword = await hashSecret(params.password);

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
