import pool from "./src/config/db.js";

async function fixTables() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to database.");

        // Check water_logs
        try {
            await connection.query("SELECT 1 FROM water_logs LIMIT 1");
            console.log("✅ Table 'water_logs' exists.");
        } catch (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.log("⚠️ Table 'water_logs' missing. Creating...");
                await connection.query(`
          CREATE TABLE water_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            amount_ml INT NOT NULL,
            logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            note VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);
                console.log("✅ Table 'water_logs' created.");
            } else {
                console.error("Error checking water_logs:", err);
            }
        }

        // Check body_metrics
        try {
            await connection.query("SELECT 1 FROM body_metrics LIMIT 1");
            console.log("✅ Table 'body_metrics' exists.");
        } catch (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.log("⚠️ Table 'body_metrics' missing. Creating...");
                await connection.query(`
          CREATE TABLE body_metrics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            weight_kg DECIMAL(5,2) NOT NULL,
            body_fat_percent DECIMAL(5,2),
            notes VARCHAR(255),
            recorded_at DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);
                console.log("✅ Table 'body_metrics' created.");
            } else {
                console.error("Error checking body_metrics:", err);
            }
        }

        connection.release();
        console.log("Table check/fix completed.");
        process.exit(0);
    } catch (error) {
        console.error("Fatal error:", error);
        process.exit(1);
    }
}

fixTables();
