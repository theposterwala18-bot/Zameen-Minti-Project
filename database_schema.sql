CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  mobile TEXT,
  language TEXT DEFAULT 'pa',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE measurement_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  shape_type TEXT NOT NULL,
  top_side REAL,
  bottom_side REAL,
  left_side REAL,
  right_side REAL,
  length REAL,
  width REAL,
  side_a REAL,
  side_b REAL,
  side_c REAL,
  total_sqft REAL NOT NULL,
  marla REAL,
  kanal REAL,
  acre REAL,
  vishve REAL,
  bigha REAL,
  formula_used TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE formula_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marla_sqft REAL DEFAULT 272.25,
  kanal_sqft REAL DEFAULT 5445,
  acre_sqft REAL DEFAULT 43560,
  kanal_marla REAL DEFAULT 20,
  acre_kanal REAL DEFAULT 8,
  acre_marla REAL DEFAULT 160,
  acre_vishve REAL DEFAULT 96,
  kanal_vishve REAL DEFAULT 12,
  bigha_vishve REAL DEFAULT 20,
  updated_by TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
