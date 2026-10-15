CREATE TABLE houses (
  id SERIAL PRIMARY KEY,
  owner_name TEXT NOT NULL,
  address TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  house_id INTEGER NOT NULL REFERENCES houses(id),
  visit_date DATE NOT NULL,
  visit_hour INTEGER NOT NULL CHECK (visit_hour BETWEEN 7 AND 21),
  job TEXT NOT NULL CHECK (length(trim(job)) BETWEEN 1 AND 200),
  draft_subject TEXT,
  draft_body TEXT,
  draft_source TEXT CHECK (draft_source IN ('ai', 'template')),
  UNIQUE (visit_date, visit_hour)
);

-- Fictional owners, streets and reserved example.com emails.
INSERT INTO houses (owner_name, address, email) VALUES
  ('Aina Rahman', '12, Jalan Meranti Ceria, Shah Alam', 'aina@example.com'),
  ('Daniel Tan', '8, Jalan Cengal Indah, Subang Jaya', 'daniel@example.com'),
  ('Kavitha Menon', '23, Jalan Kenanga Ria, Petaling Jaya', 'kavitha@example.com'),
  ('Hakim Ismail', '5, Jalan Sena Damai, Klang', 'hakim@example.com'),
  ('Mei Ling Wong', '17, Jalan Anggerik Murni, Puchong', 'meiling@example.com'),
  ('Arun Kumar', '31, Jalan Jati Mesra, Kajang', 'arun@example.com');

-- Seed relative to CURRENT_DATE; the session uses Malaysia's date.
SET TIME ZONE 'Asia/Kuala_Lumpur';
INSERT INTO visits (house_id, visit_date, visit_hour, job) VALUES
  (1, CURRENT_DATE + 1, 9, 'Kitchen sink is draining slowly.'),
  (1, CURRENT_DATE + 8, 14, 'Replace the leaking garden tap.'),
  (2, CURRENT_DATE + 3, 11, 'Check water pressure in the upstairs bathroom.'),
  (1, CURRENT_DATE - 5, 10, 'Repair the bathroom basin pipe.');
