"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_upload_1 = require("graphql-upload");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./commons/filter/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use((0, graphql_upload_1.graphqlUploadExpress)());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map