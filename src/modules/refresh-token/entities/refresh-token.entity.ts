import { Session } from '@/modules/session/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('refresh_tokens')
@Index(['sessionId', 'revokedAt', 'expiresAt'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sessionId: string;

  @ManyToOne(() => Session, (session) => session.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session?: Session;

  @Column({ type: 'varchar', length: 255, unique: true })
  tokenHash: string;

  @Index()
  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime', nullable: true })
  revokedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
