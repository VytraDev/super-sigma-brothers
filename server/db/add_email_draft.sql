-- Run this on an already-seeded database. Fresh installs get these columns from schema.sql.
ALTER TABLE visits ADD COLUMN draft_subject TEXT;
ALTER TABLE visits ADD COLUMN draft_body TEXT;
ALTER TABLE visits ADD COLUMN draft_source TEXT CHECK (draft_source IN ('ai', 'template'));

-- Fictional owners, streets and reserved example.com emails.