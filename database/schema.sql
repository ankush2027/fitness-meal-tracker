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
  meal_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

