import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException, SafeUser } from '@/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get user by id
   * - Throws NotFoundException if user does not exist
   */
  async getById(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user)
      throw new NotFoundException({
        message: 'User not exist in database',
        error: 'User Not Found',
      } as BaseException);

    return user;
  }

  /**
   * Find user by email
   * - Used to check if email exists
   */
  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }
}
