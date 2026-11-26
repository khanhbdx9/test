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
export declare const configuration: () => AppConfiguration;
