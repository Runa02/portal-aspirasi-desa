BEGIN;
  
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'warga' CHECK (role IN ('warga','petugas','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wilayahs (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  wilayah_id BIGINT NOT NULL REFERENCES wilayahs(id) ON DELETE RESTRICT,
  phone VARCHAR(25),
  address TEXT,
  rt VARCHAR(3),
  rw VARCHAR(3),
  nik VARCHAR(16) UNIQUE CHECK (nik IS NULL OR nik ~ '^[0-9]{16}$')
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'diajukan'
    CHECK (status IN ('diajukan','diproses','selesai','ditolak')),
  report_type VARCHAR(20) NOT NULL DEFAULT 'pengaduan' CHECK (report_type IN ('pengaduan', 'aspirasi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_attachments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL
    REFERENCES reports(id) ON DELETE CASCADE,

  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,

  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS report_tags (
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (report_id, tag_id)
);

CREATE TABLE IF NOT EXISTS report_status_history (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  changed_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  note TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_assignments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  officer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  note TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_category_id ON reports(category_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_comments_report_id ON comments(report_id);
CREATE INDEX IF NOT EXISTS idx_report_status_history_report_id ON report_status_history(report_id);
COMMIT;
BEGIN;
  
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'warga' CHECK (role IN ('warga','petugas','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wilayahs (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  wilayah_id BIGINT NOT NULL REFERENCES wilayahs(id) ON DELETE RESTRICT,
  phone VARCHAR(25),
  address TEXT,
  rt VARCHAR(3),
  rw VARCHAR(3),
  nik VARCHAR(16) UNIQUE CHECK (nik IS NULL OR nik ~ '^[0-9]{16}$')
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'diajukan'
    CHECK (status IN ('diajukan','diproses','selesai','ditolak')),
  report_type VARCHAR(20) NOT NULL DEFAULT 'pengaduan' CHECK (report_type IN ('pengaduan', 'aspirasi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_attachments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL
    REFERENCES reports(id) ON DELETE CASCADE,

  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,

  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS report_tags (
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (report_id, tag_id)
);

CREATE TABLE IF NOT EXISTS report_status_history (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  changed_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  note TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_assignments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  officer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  note TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_category_id ON reports(category_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_comments_report_id ON comments(report_id);
CREATE INDEX IF NOT EXISTS idx_report_status_history_report_id ON report_status_history(report_id);
COMMIT;
BEGIN;
  
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'warga' CHECK (role IN ('warga','petugas','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wilayahs (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  wilayah_id BIGINT NOT NULL REFERENCES wilayahs(id) ON DELETE RESTRICT,
  phone VARCHAR(25),
  address TEXT,
  rt VARCHAR(3),
  rw VARCHAR(3),
  nik VARCHAR(16) UNIQUE CHECK (nik IS NULL OR nik ~ '^[0-9]{16}$')
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'diajukan'
    CHECK (status IN ('diajukan','diproses','selesai','ditolak')),
  report_type VARCHAR(20) NOT NULL DEFAULT 'pengaduan' CHECK (report_type IN ('pengaduan', 'aspirasi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_attachments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL
    REFERENCES reports(id) ON DELETE CASCADE,

  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,

  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS report_tags (
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (report_id, tag_id)
);

CREATE TABLE IF NOT EXISTS report_status_history (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  changed_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  note TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_assignments (
  id BIGSERIAL PRIMARY KEY,
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  officer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  note TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_category_id ON reports(category_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_comments_report_id ON comments(report_id);
CREATE INDEX IF NOT EXISTS idx_report_status_history_report_id ON report_status_history(report_id);
COMMIT;

