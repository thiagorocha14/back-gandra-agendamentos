import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** Valores esperados: cash | card | bundle */
@Entity('booking_payments')
export class BookingPayment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'booking_id', type: 'bigint' })
  bookingId: string;

  @Column({ name: 'payment_method', type: 'varchar', length: 32 })
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  amount: string;

  @Column({ name: 'bundle_use_id', type: 'bigint', nullable: true })
  bundleUseId: string | null;

  @CreateDateColumn({ name: 'paid_at', type: 'timestamp' })
  paidAt: Date;
}
