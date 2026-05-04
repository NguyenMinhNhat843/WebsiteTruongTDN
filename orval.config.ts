import { defineConfig } from "orval";

export default defineConfig({
  studentApi: {
    input: {
      target: "http://localhost:3000/docs-json", // URL xuất JSON từ NestJS Swagger
    },
    output: {
      mode: "tags-split", // Chia file theo @ApiTags (Students, Users, v.v.)
      target: "./src/api/generated", // Thư mục chứa các hooks sinh ra
      schemas: "./src/api/model", // Thư mục chứa các Interface/DTO
      client: "react-query", // Sinh code cho TanStack Query (React)
      clean: true, // Xóa code cũ trước khi gen mới
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts", // Đường dẫn tới file axios custom
          name: "customInstance",
        },
      },
    },
  },
});
