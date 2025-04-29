// Configuration file example for ts-migrate-mongoose:
// You can also use .env instead of a config file

export default {
  mode: "development",
  uri: process.env.MIGRATE_MONGODB_URI,
  collection: "migrations",
  migrationsPath: "./migrations",

  // "templatePath": "./migrations/template.ts",
  // "autosync": false
};
