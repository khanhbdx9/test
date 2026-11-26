export const SYSTEM_CONFIG_KEYS = {
  EMAIL_NOTIFICATION: 'EMAIL_NOTIFICATION',
  QR_PAYMENT: 'QR_PAYMENT',
} as const;

export type SystemConfigKey =
  (typeof SYSTEM_CONFIG_KEYS)[keyof typeof SYSTEM_CONFIG_KEYS];
