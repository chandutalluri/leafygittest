export declare class HealthController {
    health(): {
        status: string;
        service: string;
        port: string | number;
        timestamp: string;
        version: string;
    };
}
