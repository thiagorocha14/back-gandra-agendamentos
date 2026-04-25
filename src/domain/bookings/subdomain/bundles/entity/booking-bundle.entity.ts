import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('booking_bundles')
export class BookingBundle {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 255, nullable: true })
  coverImage: string | null;

  @Column({ name: 'total_hours', type: 'int' })
  totalHours: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
