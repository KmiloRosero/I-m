# Portafolio de Camilo Rosero

Portafolio personal construido con Next.js, TypeScript y Tailwind CSS, pensado para desplegarse en Vercel.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```


## Estructura

- `src/app`: layout, página principal, casos de estudio en `proyectos/[slug]`, ícono y `globals.css`.
- `src/sections`: una sección de la página por archivo.
- `src/components`: `common`, `layout`, `navigation`, `projects` y `ui`.
- `src/data` y `src/types`: contenido centralizado y sus tipos. El enlace del CV es `cvUrl` en `personalInfo.ts`.
- `src/styles`: tokens de diseño y hojas de estilo por responsabilidad.
- `src/hooks`: lógica reutilizable del cliente.
- `public/images`: imágenes estáticas.

## Despliegue en Vercel

1. Importa el repositorio `KmiloRosero/I-m` en Vercel; detecta Next.js sin configuración adicional.
2. Usa Node.js 20.9 o superior.
3. Publica. Cada push a `main` genera un despliegue nuevo.

La URL canónica y el sitemap usan el dominio de producción que Vercel entrega en `VERCEL_PROJECT_PRODUCTION_URL`; no hay que configurar variables.
