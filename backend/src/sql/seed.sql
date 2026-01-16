INSERT INTO users (id, name, email, timezone)
VALUES (1, 'Alex Morgan', 'alex@example.com', 'America/New_York')
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_types (user_id, name, duration_min, slug)
VALUES
  (1, '15 Minute Intro', 15, '15-min-intro'),
  (1, '30 Minute Project Fit', 30, '30-min-project-fit'),
  (1, '60 Minute Strategy Session', 60, '60-min-strategy-session')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO availability (user_id, timezone)
SELECT 1, 'America/New_York'
WHERE NOT EXISTS (SELECT 1 FROM availability WHERE user_id = 1);

INSERT INTO availability_days (availability_id, day_of_week, start_time, end_time)
SELECT availability.id, day.day_of_week, day.start_time::TIME, day.end_time::TIME
FROM availability
CROSS JOIN (
  VALUES
    (1, '09:00', '17:00'),
    (2, '09:00', '17:00'),
    (3, '09:00', '17:00'),
    (4, '09:00', '17:00'),
    (5, '09:00', '16:00')
) AS day(day_of_week, start_time, end_time)
WHERE availability.user_id = 1
  AND NOT EXISTS (
    SELECT 1 FROM availability_days WHERE availability_id = availability.id
  );

INSERT INTO meetings (event_type_id, invitee_name, invitee_email, start_at, end_at, status)
VALUES
  ((SELECT id FROM event_types WHERE slug = '30-min-project-fit'), 'Jamie Lee', 'jamie@example.com', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 30 minutes', 'scheduled'),
  ((SELECT id FROM event_types WHERE slug = '15-min-intro'), 'Taylor Cruz', 'taylor@example.com', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '15 minutes', 'scheduled')
ON CONFLICT DO NOTHING;
