import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('booking_bundle_purchase_intents')
export class BookingBundlePurchaseIntent {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;

  @Column({ name: 'bundle_id', type: 'bigint' })
  bundleId: string;

  @Column({
    name: 'mp_preference_id',
    type: 'varchar',
    length: 64,
    nullable: true,
    unique: true,
  })
  mpPreferenceId: string | null;

  @Column({ name: 'amount_snapshot', type: 'decimal', precision: 8, scale: 2 })
  amountSnapshot: string;

  @Column({ name: 'hours_snapshot', type: 'int' })
  hoursSnapshot: number;

  @Column({ type: 'boolean', default: false })
  fulfilled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
