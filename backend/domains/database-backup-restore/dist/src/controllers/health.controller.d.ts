export declare class HealthController {
    getHealth(): {
        status: string;
        service: string;
        port: string | number;
        timestamp: string;
    };
    getInfo(): {
        service: string;
        version: string;
        description: string;
        endpoints: {
            health: string;
            docs: string;
            backup: string;
            restore: string;
        };
    };
}
