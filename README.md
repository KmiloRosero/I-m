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

- `src/app`: layout y página principal.
- `src/components`: `layout`, `sections`, `terrain` y `ui`.
- `src/data`: perfil, navegación y proyectos. El enlace del CV se configura en `profile.ts`, en el campo `cvUrl`.
- `src/hooks`, `src/types` y `src/styles`: lógica reutilizable, tipos y tokens de diseño.
- `src/assets`: imágenes y datos del terreno.
