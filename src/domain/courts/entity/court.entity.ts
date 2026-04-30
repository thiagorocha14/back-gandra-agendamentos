import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'float', nullable: false })
  day_price: number;

  @Column({ type: 'float', nullable: false })
  night_price: number;
}
