import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-koa";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shopify App API",
      version: "1.0.0",
      description: "API docs for Shopify App Backend (KoaJS)",
    },
    servers: [
      {
        url: "http://localhost:4000/api",  // đổi theo server của bạn
      },
    ],
  },
  apis: ["./routes/*.js"], // path chứa định nghĩa swagger bằng comment
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiMiddleware = swaggerUi;
