import { DataSource } from "typeorm";

new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "hms",
    synchronize: true,
    // logging: true,
    entities: ['src/Entities/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
}) 