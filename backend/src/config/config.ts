export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  jwtSecret: 'jwt_secret',

  db: {
    type: process.env.POSTGRES_TYPE ?? 'postgres',
    database: process.env.POSTGRES_DB ?? 'postgres',

    username: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'password',

    host: process.env.POSTGRES_HOST ?? 'postgres',
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT)
      : 5432,

    autoLoadModels: true,
  },
});
