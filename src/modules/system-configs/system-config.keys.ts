export const SYSTEM_CONFIG_KEYS = {
  EMAIL_NOTIFICATION: 'EMAIL_NOTIFICATION',
} as const;

export type SystemConfigKey =
  (typeof SYSTEM_CONFIG_KEYS)[keyof typeof SYSTEM_CONFIG_KEYS];
