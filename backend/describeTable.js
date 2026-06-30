import pool from "./src/config/db.js";

async function describeTable() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("DESCRIBE meals");
        console.log("Columns in meals:");
        rows.forEach(row => {
            console.log(`- ${row.Field} (${row.Type})`);
        });
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

describeTable();
