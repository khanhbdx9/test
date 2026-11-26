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
  mail: {
    enabled: boolean;
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    from?: string;
  };
}

export const configuration = (): AppConfiguration => {
  const port = Number(process.env.PORT ?? 3000);
  const databaseUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpPort = smtpPortRaw ? Number(smtpPortRaw) : undefined;

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
    mail: {
      // MAIL_ENABLED=false để tắt gửi mail trên server khi SMTP bị block/treo.
      enabled: process.env.MAIL_ENABLED?.trim().toLowerCase() !== 'false',
      host: process.env.SMTP_HOST?.trim() || undefined,
      port:
        smtpPort !== undefined && !Number.isNaN(smtpPort) ? smtpPort : undefined,
      user: process.env.SMTP_USER?.trim() || undefined,
      pass: process.env.SMTP_PASS || undefined,
      from: process.env.SMTP_FROM?.trim() || undefined,
    },
  };
};
