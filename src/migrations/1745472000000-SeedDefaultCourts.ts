import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultCourts1745472000000 implements MigrationInterface {
  name = 'SeedDefaultCourts1745472000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`courts\` (\`name\`, \`active\`, \`day_price\`, \`night_price\`) VALUES
      ('Quadra 1', 1, 90, 90),
      ('Quadra 2', 1, 70, 80),
      ('Quadra 3', 1, 70, 80),
      ('Quadra 4', 1, 70, 80)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`courts\`
      WHERE \`name\` IN ('Quadra 1', 'Quadra 2', 'Quadra 3', 'Quadra 4')
    `);
  }
}
