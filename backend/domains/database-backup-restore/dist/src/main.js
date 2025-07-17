"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const db_1 = require("../drizzle/db");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const PORT = process.env.PORT || 3045;
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3003'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Database Backup & Restore API')
        .setDescription('Professional PostgreSQL backup and restore service with Google Cloud Storage')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(PORT, '127.0.0.1');
    console.log(`[database-backup-restore] Microservice is running on: http://127.0.0.1:${PORT}`);
    console.log(`[database-backup-restore] API documentation available at: http://127.0.0.1:${PORT}/api/docs`);
    process.on('SIGINT', async () => {
        console.log('[database-backup-restore] Received SIGINT, shutting down gracefully...');
        await (0, db_1.closeDatabase)();
        await app.close();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        console.log('[database-backup-restore] Received SIGTERM, shutting down gracefully...');
        await (0, db_1.closeDatabase)();
        await app.close();
        process.exit(0);
    });
}
bootstrap().catch((error) => {
    console.error('[database-backup-restore] Failed to start service:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map