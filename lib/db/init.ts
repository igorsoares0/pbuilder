import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Read schema file
    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema
    await sql.query(schema);

    console.log('✅ Database initialized successfully!');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - conversations');
    console.log('  - messages');
    console.log('  - artifacts');
    console.log('  - indexes');
    console.log('\nMock user created with ID: 00000000-0000-0000-0000-000000000001');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
