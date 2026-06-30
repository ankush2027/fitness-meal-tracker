DROP DATABASE IF EXISTS fitness_tracker;
CREATE DATABASE fitness_tracker;
USE fitness_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  goal ENUM('weight_loss', 'muscle_gain', 'maintenance') DEFAULT 'maintenance',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  workout_type VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,
  calories_burned INT DEFAULT 0,
  workout_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  meal_name VARCHAR(150) NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
  calories INT DEFAULT 0,
  protein INT DEFAULT 0,
  carbs INT DEFAULT 0,
  fats INT DEFAULT 0,
  fiber INT DEFAULT 0,
  meal_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE food_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  food_name VARCHAR(150) NOT NULL UNIQUE,
  calories INT DEFAULT 0,
  protein DECIMAL(5,2) DEFAULT 0,
  carbs DECIMAL(5,2) DEFAULT 0,
  fats DECIMAL(5,2) DEFAULT 0,
  fiber DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  media_url VARCHAR(255),
  target_muscle VARCHAR(100),
  equipment VARCHAR(100)
);

CREATE TABLE meal_suggestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  goal ENUM('weight_loss', 'muscle_gain', 'maintenance') NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  calories INT,
  protein INT,
  carbs INT,
  fats INT,
  priority INT DEFAULT 1
);

CREATE TABLE water_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount_ml INT NOT NULL,
  logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wellness_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mood ENUM('low', 'neutral', 'high') NOT NULL,
  energy_level TINYINT UNSIGNED CHECK (energy_level BETWEEN 1 AND 10),
  sleep_hours DECIMAL(4,2) CHECK (sleep_hours BETWEEN 0 AND 24),
  notes VARCHAR(255),
  log_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE body_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  body_fat_percent DECIMAL(5,2),
  notes VARCHAR(255),
  recorded_at DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, goal)
VALUES
  ('Demo User', 'demo@example.com', '$2a$10$uCVIfgEEGDvkj8FW2tFdoObM5T3wD2udCgBMn/Yqana9XyFj7idDW', 'maintenance');

INSERT INTO exercises (name, description, media_url, target_muscle, equipment) VALUES
  ('Push Up', 'Bodyweight push exercise for chest and triceps.', 'https://example.com/pushup.png', 'Chest', 'Bodyweight'),
  ('Squat', 'Lower body compound movement.', 'https://example.com/squat.png', 'Legs', 'Bodyweight'),
  ('Deadlift', 'Posterior chain strength exercise.', 'https://example.com/deadlift.png', 'Back', 'Barbell'),
  ('Plank', 'Core stability drill.', 'https://example.com/plank.png', 'Core', 'Bodyweight');

INSERT INTO meal_suggestions (goal, title, description, calories, protein, carbs, fats, priority) VALUES
  ('weight_loss', 'Grilled Chicken Salad', 'Lean protein with leafy greens and vinaigrette.', 420, 38, 25, 18, 1),
  ('muscle_gain', 'Steak with Sweet Potato', 'High-protein meal to support muscle growth.', 650, 52, 55, 20, 1),
  ('maintenance', 'Mediterranean Bowl', 'Balanced bowl with chickpeas, veggies, and grains.', 520, 24, 60, 18, 1);

INSERT INTO workouts (user_id, workout_type, duration_minutes, calories_burned, workout_date) VALUES
  (1, 'Running', 30, 320, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (1, 'Strength Training', 45, 400, DATE_SUB(CURDATE(), INTERVAL 3 DAY));

INSERT INTO meals (user_id, meal_name, meal_type, calories, protein, carbs, fats, meal_date) VALUES
  (1, 'Greek Yogurt Parfait', 'breakfast', 320, 24, 40, 8, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (1, 'Salmon Bowl', 'dinner', 520, 40, 45, 20, DATE_SUB(CURDATE(), INTERVAL 1 DAY));



INSERT INTO body_metrics (user_id, weight_kg, body_fat_percent, notes, recorded_at) VALUES
  (1, 72.80, 18.5, 'Feeling strong after workout block', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (1, 72.40, 18.2, 'Hydration on point', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

INSERT INTO water_logs (user_id, amount_ml, logged_at, note) VALUES
  (1, 300, DATE_SUB(NOW(), INTERVAL 4 HOUR), 'Morning hydration'),
  (1, 500, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Post workout'),
  (1, 250, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'Afternoon sip');

INSERT INTO wellness_logs (user_id, mood, energy_level, sleep_hours, notes, log_date) VALUES
  (1, 'high', 8, 7.5, 'Feeling great after run', CURDATE()),
  (1, 'neutral', 6, 6.0, 'Need more sleep', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

