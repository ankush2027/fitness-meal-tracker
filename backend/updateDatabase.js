import pool from "./src/config/db.js";

async function updateDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to database.");

        // 1. Add fiber column to meals if it doesn't exist
        const [columns] = await connection.query("SHOW COLUMNS FROM meals");
        const hasFiber = columns.some(col => col.Field === 'fiber');
        if (!hasFiber) {
            console.log("Adding 'fiber' column to 'meals' table...");
            await connection.query("ALTER TABLE meals ADD COLUMN fiber INT DEFAULT 0");
            console.log("✅ Column 'fiber' added to 'meals' table.");
        } else {
            console.log("✅ Column 'fiber' already exists in 'meals' table.");
        }

        // 2. Create food_cache table if it doesn't exist
        console.log("Creating 'food_cache' table if it doesn't exist...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS food_cache (
                id INT AUTO_INCREMENT PRIMARY KEY,
                food_name VARCHAR(150) NOT NULL UNIQUE,
                calories INT DEFAULT 0,
                protein DECIMAL(5,2) DEFAULT 0,
                carbs DECIMAL(5,2) DEFAULT 0,
                fats DECIMAL(5,2) DEFAULT 0,
                fiber DECIMAL(5,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Table 'food_cache' is ready.");

        connection.release();
        console.log("Database update completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating database:", error);
        process.exit(1);
    }
}

updateDatabase();
