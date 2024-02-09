import { createClient } from "@libsql/client";
const tursoClient = createClient({
    url: "libsql://testimonials-subashrijal5.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MDc0OTMzNTgsImlkIjoiYzc0YWEzODYtYzc2MS0xMWVlLWIzN2EtMTYxYzc2NWUxOGFlIn0.dOAVx30WNEXPAo_9ojFFhSd5Xiv01dIvmPmB69KfNSR5XSBkZVRqZmB3mr602BVugQPIEavnUF7TrQOiz4mcDA",
});

await tursoClient.batch(
    [
        `CREATE TABLE IF NOT EXISTS testimonials 
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project VARCHAR(255) NOT NULL,
            from_name VARCHAR(255) NOT NULL,
            company_name VARCHAR(255),
            star_count INTEGER NOT NULL,
            description TEXT NOT NULL,
            status boolean,
            sort_order INTEGER,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`,
            
    ],
    "write"
);


const {rows} = await tursoClient.execute(`SELECT * FROM testimonials where project = 'bilingual'`)

console.log("🚀 ~ data:", rows)
