import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultCourts1745472000000 implements MigrationInterface {
  name = 'SeedDefaultCourts1745472000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`courts\` (\`name\`, \`active\`) VALUES
      ('Quadra 1', 1),
      ('Quadra 2', 1),
      ('Quadra 3', 1),
      ('Quadra 4', 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`courts\`
      WHERE \`name\` IN ('Quadra 1', 'Quadra 2', 'Quadra 3', 'Quadra 4')
    `);
  }
}
