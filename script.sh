#!/bin/bash
##Drop Database

echo "Dropping database if exists..."

psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS notes_manager;"

echo "Setting up Notes Manager DB....."

# Create the database
psql -U postgres -h localhost -c "CREATE DATABASE notes_manager;"

# Run migrations 
psql -U postgres -h localhost -d notes_manager -f src/database/migration/001_migration.sql

#Run the stored procedures
psql -U postgres -h localhost -d notes_manager -f src/database/procedures/sp_create_note.sql
psql -U postgres -h localhost -d notes_manager -f src/database/procedures/sp_get_all_notes.sql
psql -U postgres -h localhost -d notes_manager -f src/database/procedures/sp_get_note_by_id.sql
psql -U postgres -h localhost -d notes_manager -f src/database/procedures/sp_update_note.sql
psql -U postgres -h localhost -d notes_manager -f src/database/procedures/sp_delete_note.sql

echo "DATABASE setup complete..."

echo "You can now run: npm run start:dev"