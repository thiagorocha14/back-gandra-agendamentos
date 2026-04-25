import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('bookings')
@Index('uq_court_slot', ['courtId', 'bookingDate', 'startTime', 'endTime'], {
  unique: true,
})
export class Booking {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'court_id', type: 'int' })
  courtId: number;

  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId: string | null;

  @Column({ name: 'guest_name', type: 'varchar', length: 100, nullable: true })
  guestName: string | null;

  @Column({ name: 'phone', type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ name: 'booking_date', type: 'date' })
  bookingDate: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  price: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'approved_by', type: 'bigint', nullable: true })
  approvedBy: string | null;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date | null;
}
