# Portafolio de Camilo Rosero

Portafolio personal construido con Next.js, TypeScript y Tailwind CSS, pensado para desplegarse en Vercel.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

`npm run terrain` regenera las curvas de nivel del volcán Galeras a partir de datos reales de elevación.

## Estructura

- `src/app`: layout, página principal, ícono y `globals.css`.
- `src/sections`: una sección de la página por archivo.
- `src/components`: `common`, `layout`, `navigation` y `ui`.
- `src/data` y `src/types`: contenido centralizado y sus tipos. El enlace del CV es `cvUrl` en `personalInfo.ts`.
- `src/styles`: tokens de diseño y hojas de estilo por responsabilidad.
- `src/hooks`: lógica reutilizable del cliente.
- `src/assets/terrain`: datos del Galeras, cargados de forma diferida.
- `public/images`: imágenes estáticas.
