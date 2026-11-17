export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
}

export const configuration = (): AppConfiguration => {
  const port = Number(process.env.PORT ?? 3000);
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

  if (
    !databaseUrl ||
    !jwtSecret ||
    !jwtExpiresIn ||
    !refreshSecret ||
    !refreshExpiresIn
  ) {
    throw new Error('Thiếu biến môi trường bắt buộc');
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number.isNaN(port) ? 3000 : port,
    databaseUrl,
    jwt: {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
      refreshSecret,
      refreshExpiresIn,
    },
  };
};
