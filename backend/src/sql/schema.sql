CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'America/New_York'
);

CREATE TABLE IF NOT EXISTS event_types (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timezone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS availability_days (
  id SERIAL PRIMARY KEY,
  availability_id INTEGER NOT NULL REFERENCES availability(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS availability_overrides (
  id SERIAL PRIMARY KEY,
  availability_id INTEGER NOT NULL REFERENCES availability(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_unavailable BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS meetings (
  id SERIAL PRIMARY KEY,
  event_type_id INTEGER NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  invitee_name TEXT NOT NULL,
  invitee_email TEXT NOT NULL,
  start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  canceled_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
