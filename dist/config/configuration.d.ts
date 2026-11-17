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
export declare const configuration: () => AppConfiguration;
