export declare const SYSTEM_CONFIG_KEYS: {
    readonly EMAIL_NOTIFICATION: "EMAIL_NOTIFICATION";
    readonly QR_PAYMENT: "QR_PAYMENT";
};
export type SystemConfigKey = (typeof SYSTEM_CONFIG_KEYS)[keyof typeof SYSTEM_CONFIG_KEYS];
