import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('booking_bundle_balance')
export class BookingBundleBalance {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;

  @Column({ name: 'bundle_id', type: 'bigint' })
  bundleId: string;

  @Column({ name: 'hours_total', type: 'decimal', precision: 5, scale: 2 })
  hoursTotal: string;

  @Column({ name: 'hours_used', type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursUsed: string;

  @Column({ name: 'hours_remaining', type: 'decimal', precision: 5, scale: 2 })
  hoursRemaining: string;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn({ name: 'purchased_at', type: 'timestamp' })
  purchasedAt: Date;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 8, scale: 2 })
  amountPaid: string;
}
