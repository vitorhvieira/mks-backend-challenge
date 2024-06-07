import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerDocument = new DocumentBuilder()
  .setTitle('Desafio MKS')
  .setDescription('Esta é uma API para um catálogo de filmes proposta pela MKS')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Insira um token valido!',
      in: 'header',
    },
    'token',
  )
  .build();
