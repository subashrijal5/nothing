import { createClient } from "@libsql/client";
const tursoClient = createClient({
    url: process.env.TURSO_URL,
    authToken: PROCESS.ENV.TURSO_TOKEN,
});

await tursoClient.batch(
    [
        `DROP TABLE notifications`,
        `DROP TABLE notification_logs`,
        `CREATE TABLE IF NOT EXISTS notifications 
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_user VARCHAR(255) NOT NULL,
            from_name VARCHAR(255) NOT NULL,
            to_name VARCHAR(255) NOT NULL,
            to_user VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            text TEXT,
            html TEXT,
            source TEXT NOT NULL,
            dispatcher TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`,
        
        `CREATE TABLE IF NOT EXISTS notification_logs
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            notification_id INTEGER NOT NULL,
            status VARCHAR(255) NOT NULL,
            message TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (notification_id) REFERENCES notifications(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );`,
            
    ],
    "write"
);
