import pool from './pool';

const migrate = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(255) NOT NULL,
        job_title   VARCHAR(255) NOT NULL,
        job_type    VARCHAR(20) NOT NULL CHECK (job_type IN ('Internship', 'Full-time', 'Part-time')),
        status      VARCHAR(20) NOT NULL DEFAULT 'Applied'
                      CHECK (status IN ('Applied', 'Interviewing', 'Offer', 'Rejected')),
        applied_date DATE NOT NULL,
        notes       TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Trigger to auto-update updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
      CREATE TRIGGER update_applications_updated_at
        BEFORE UPDATE ON applications
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    // Indexes for common queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date DESC);
      CREATE INDEX IF NOT EXISTS idx_applications_company_name ON applications USING gin(to_tsvector('english', company_name));
    `);

    await client.query('COMMIT');
    console.log(' Migration completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(' Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
