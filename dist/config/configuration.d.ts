export type MailTransport = 'smtp' | 'gmail-api';
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
        transport: MailTransport;
        host?: string;
        port?: number;
        user?: string;
        pass?: string;
        from?: string;
        gmail: {
            clientId?: string;
            clientSecret?: string;
            refreshToken?: string;
        };
    };
}
export declare const configuration: () => AppConfiguration;
