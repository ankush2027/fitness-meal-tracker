import pool from "./src/config/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "../database/schema.sql");

async function applySchema() {
    try {
        console.log("Reading schema...");
        let schema = await fs.readFile(schemaPath, "utf8");

        // Remove database creation/selection commands as we are already connected to the DB
        schema = schema.replace(/DROP DATABASE IF EXISTS fitness_tracker;/g, "");
        schema = schema.replace(/CREATE DATABASE fitness_tracker;/g, "");
        schema = schema.replace(/USE fitness_tracker;/g, "");

        // Split into individual statements
        const statements = schema
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        console.log(`Found ${statements.length} statements to execute.`);

        const connection = await pool.getConnection();

        try {
            // Disable foreign key checks temporarily to avoid issues with table order
            await connection.query("SET FOREIGN_KEY_CHECKS = 0");

            for (const statement of statements) {
                try {
                    await connection.query(statement);
                    // console.log("Executed statement");
                } catch (err) {
                    console.error(`Error executing statement: ${statement.substring(0, 50)}...`);
                    console.error(err.message);
                    // Continue even if error (e.g. table already exists)
                }
            }

            await connection.query("SET FOREIGN_KEY_CHECKS = 1");
            console.log("Schema application completed.");
        } finally {
            connection.release();
        }

        process.exit(0);
    } catch (error) {
        console.error("Fatal error applying schema:", error);
        process.exit(1);
    }
}

applySchema();
