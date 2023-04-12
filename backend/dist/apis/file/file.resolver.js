"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const file_service_1 = require("./file.service");
const graphql_upload_1 = require("graphql-upload");
let FileResolver = class FileResolver {
    constructor(fileService) {
        this.fileService = fileService;
    }
    uploadFile(files) {
        return this.fileService.upload({ files });
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => [String]),
    __param(0, (0, graphql_1.Args)({ name: 'files', type: () => [graphql_upload_1.GraphQLUpload] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], FileResolver.prototype, "uploadFile", null);
FileResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileResolver);
exports.FileResolver = FileResolver;
//# sourceMappingURL=file.resolver.js.map