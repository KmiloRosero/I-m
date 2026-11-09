import { perLocale, translator, type Locale } from '@/i18n/config'
import type { Article, ArticleBlock } from '@/types/blog'

const REPOSITORY = 'https://github.com/KmiloRosero/I-m'

const paragraph = (text: string): ArticleBlock => ({ type: 'paragraph', text })
const heading = (text: string): ArticleBlock => ({ type: 'heading', text })
const list = (items: readonly string[]): ArticleBlock => ({ type: 'list', items })
const code = (language: string, source: string): ArticleBlock => ({ type: 'code', language, code: source })

export const getArticles = perLocale((locale): readonly Article[] => {
  const t = translator(locale)

  const articles: Article[] = [
    {
      slug: 'portatil-3d-threejs',
      published: '2026-11-08',
      tags: ['Three.js', 'TypeScript', 'WebGL'],
      title: t(
        'Cómo construí un portátil 3D interactivo con Three.js',
        'How I built an interactive 3D laptop with Three.js',
      ),
      description: t(
        'El portátil del inicio no es un modelo descargado: está hecho con código, con física de resortes, teclas que se presionan y una pantalla que es un canvas.',
        "The laptop on my home page isn't a downloaded model: it's made in code, with spring physics, keys you can press and a screen that is a canvas.",
      ),
      blocks: [
        paragraph(
          t(
            'En el inicio de este portafolio hay un portátil que puedes girar, abrir, cerrar y hasta usar para escribir. Es una MSI Cyborg 15, el mismo portátil con el que programo. No lo descargué de una tienda de modelos 3D: lo armé con código, pieza por pieza, con Three.js.',
            "On the home page of this portfolio there's a laptop you can turn, open, close and even type on. It's an MSI Cyborg 15, the same laptop I code on. I didn't download it from a 3D model store: I built it in code, piece by piece, with Three.js.",
          ),
        ),
        heading(t('Un modelo hecho con medidas reales', 'A model built from real measurements')),
        paragraph(
          t(
            'Partí de las medidas del equipo, en centímetros: 35,9 × 25 × 2 para la base. Cada pieza es una geometría simple: cajas con bordes redondeados (`RoundedBoxGeometry`) para el chasis, la tapa y cada tecla, cilindros para la bisagra y planos para la pantalla y las leyendas. Al usar medidas reales, las proporciones salen bien sin ajustarlas a ojo.',
            'I started from the machine’s measurements, in centimetres: 35.9 × 25 × 2 for the base. Every piece is a simple geometry: boxes with rounded edges (`RoundedBoxGeometry`) for the chassis, the lid and each key, cylinders for the hinge, and planes for the screen and the key legends. With real measurements, the proportions come out right without eyeballing them.',
          ),
        ),
        paragraph(
          t(
            'Las letras de las teclas no son texto 3D. Las dibujo una sola vez en un canvas organizado como el teclado, y cada tecla muestra su pedazo de esa imagen: casi cien teclas con una sola textura.',
            'The letters on the keys aren’t 3D text. I draw them once on a canvas laid out like the keyboard, and each key shows its own slice of that image: almost a hundred keys with a single texture.',
          ),
        ),
        heading(t('La pantalla es un canvas', 'The screen is a canvas')),
        paragraph(
          t(
            'Lo que ves en la pantalla —mi foto, mi nombre y los enlaces— se dibuja con la API de canvas 2D y se usa como textura. Como yo controlo ese dibujo, la pantalla reacciona: si escribes en tu teclado, el texto aparece en la línea de terminal del portátil, y si haces clic en un botón de la pantalla, se abre el enlace de verdad.',
            "What you see on the screen (my photo, my name and the links) is drawn with the 2D canvas API and used as a texture. Since I control that drawing, the screen reacts: type on your keyboard and the text shows up on the laptop's terminal line; click a button on the screen and the real link opens.",
          ),
        ),
        heading(t('Física con resortes', 'Physics with springs')),
        paragraph(
          t(
            'Todo lo que se mueve —el giro, la tapa, cada tecla— es un resorte amortiguado. Un resorte tiene un valor, una velocidad y un objetivo, y en cada paso se acerca al objetivo según su rigidez y su amortiguación:',
            'Everything that moves (the rotation, the lid, each key) is a damped spring. A spring has a value, a velocity and a target, and on every step it moves toward the target according to its stiffness and damping:',
          ),
        ),
        code(
          'ts',
          `export function stepSpring(spring: Spring, stiffness: number, damping: number, dt: number) {
  spring.velocity += (stiffness * (spring.target - spring.value) - damping * spring.velocity) * dt
  spring.value += spring.velocity * dt
}`,
        ),
        paragraph(
          t(
            'La simulación avanza en pasos fijos de 1/120 de segundo, sin importar los FPS del equipo, así que el movimiento se siente igual en un celular que en un monitor de 144 Hz. Si sueltas la tapa por debajo de 16°, un “imán” la cierra; si la lanzas con fuerza, rebota un poco al llegar al tope.',
            'The simulation moves in fixed steps of 1/120 of a second, whatever the frame rate, so the motion feels the same on a phone as on a 144 Hz monitor. Let go of the lid below 16° and a “magnet” shuts it; throw it hard and it bounces a little at the end of its travel.',
          ),
        ),
        heading(t('Agarrar la tapa', 'Grabbing the lid')),
        paragraph(
          t(
            'Para arrastrar la tapa no basta con saber dónde hiciste clic: hay que convertir el movimiento del mouse en un ángulo. Lanzo un rayo desde la cámara y calculo dónde corta un cilindro imaginario alrededor de la bisagra; el ángulo de ese punto es el ángulo de la tapa. Así la tapa sigue tu dedo aunque hayas girado el portátil.',
            'Dragging the lid takes more than knowing where you clicked: the pointer’s movement has to become an angle. I cast a ray from the camera and work out where it crosses an imaginary cylinder around the hinge; that point’s angle is the lid’s angle. So the lid follows your finger even after you’ve turned the laptop.',
          ),
        ),
        heading(t('Que no gaste batería', 'Easy on the battery')),
        list(
          t(
            [
              'Solo se dibuja un fotograma cuando algo se mueve; quieto, no consume nada.',
              'Si sales del inicio, se pausa con un `IntersectionObserver`.',
              'En equipos sin tarjeta gráfica se muestra una foto del portátil con el perfil encima, encajado con una transformación `matrix3d`.',
              'Con “reducir movimiento” activado, aparece abierto y sin animaciones.',
            ],
            [
              'A frame is drawn only while something moves; when it’s still, it costs nothing.',
              'Scroll away from the home page and it pauses, through an `IntersectionObserver`.',
              'On devices without a GPU it shows a photo of the laptop with the profile fitted onto its display by a `matrix3d` transform.',
              'With “reduce motion” on, it appears open and without animations.',
            ],
          ),
        ),
        paragraph(
          t(
            `Lo construí con apoyo de Claude Code. El código completo está en el [repositorio del portafolio](${REPOSITORY}).`,
            `I built it with help from Claude Code. The full code is in the [portfolio's repository](${REPOSITORY}).`,
          ),
        ),
      ],
    },
    {
      slug: 'shaders-sin-bloquear',
      published: '2026-11-08',
      tags: ['WebGL', t('Rendimiento', 'Performance'), 'Lighthouse'],
      title: t(
        'De 8,6 a 2,4 segundos: los shaders que bloqueaban mi página',
        'From 8.6 to 2.4 seconds: the shaders that were blocking my page',
      ),
      description: t(
        'Lighthouse me dio 55 en celular. El problema no era el peso de los archivos, sino esperas a la GPU que no se veían en el código.',
        "Lighthouse gave me 55 on mobile. The problem wasn't file size but waits on the GPU that didn't show up in the code.",
      ),
      blocks: [
        paragraph(
          t(
            'Después de añadir el portátil 3D y un fondo animado con shaders, medí el inicio con Lighthouse en modo celular: 55 de rendimiento y casi 6 segundos de bloqueo del hilo principal. La página pesaba 660 KB, así que el problema no era la descarga.',
            'After adding the 3D laptop and a shader-animated background, I measured the home page with Lighthouse in mobile mode: a performance score of 55 and almost 6 seconds of main-thread blocking. The page weighed 660 KB, so downloading wasn’t the problem.',
          ),
        ),
        heading(t('Medir antes de adivinar', 'Measure before guessing')),
        paragraph(
          t(
            'Mi primera sospecha fue la geometría del modelo, y me equivoqué. Medí cada paso del arranque y luego tomé un perfil de CPU con las herramientas del navegador. Dos funciones se llevaban casi todo el tiempo, y ninguna era mía.',
            'My first suspect was the model’s geometry, and I was wrong. I timed every step of the start-up and then took a CPU profile with the browser’s tools. Two functions took almost all the time, and neither was mine.',
          ),
        ),
        heading(t('Preguntarle a la GPU hace esperar', 'Asking the GPU makes you wait')),
        paragraph(
          t(
            'En WebGL, compilar un shader es asíncrono: el navegador se lo pasa a la GPU y sigue. Pero si justo después preguntas si compiló bien (`getShaderParameter`, `getProgramInfoLog`), el hilo principal se detiene hasta que la GPU termine. Three.js hace esa pregunta por defecto para mostrar errores útiles, y mi fondo animado hacía lo mismo.',
            'In WebGL, compiling a shader is asynchronous: the browser hands it to the GPU and moves on. But if you then ask whether it compiled (`getShaderParameter`, `getProgramInfoLog`), the main thread stops until the GPU is done. Three.js asks by default, to show helpful errors, and my animated background did the same.',
          ),
        ),
        paragraph(
          t(
            'La solución tiene dos partes. En producción desactivo esa revisión en Three.js, y para mi shader uso la extensión `KHR_parallel_shader_compile`, que permite preguntar si ya terminó sin bloquear:',
            'The fix has two parts. In production I turn that check off in Three.js, and for my own shader I use the `KHR_parallel_shader_compile` extension, which lets you ask whether it has finished without blocking:',
          ),
        ),
        code(
          'ts',
          t(
            `const parallel = gl.getExtension('KHR_parallel_shader_compile')

function awaitProgram() {
  if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
    requestAnimationFrame(awaitProgram) // aún compila: revisa en el siguiente fotograma
    return
  }
  // Listo: ahora leer LINK_STATUS ya no bloquea
}`,
            `const parallel = gl.getExtension('KHR_parallel_shader_compile')

function awaitProgram() {
  if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
    requestAnimationFrame(awaitProgram) // still compiling: check again next frame
    return
  }
  // Done: reading LINK_STATUS no longer blocks
}`,
          ),
        ),
        paragraph(
          t(
            'En el portátil uso `renderer.compileAsync()`, que hace lo mismo con todos los materiales antes del primer fotograma.',
            'For the laptop I use `renderer.compileAsync()`, which does the same for every material before the first frame.',
          ),
        ),
        heading(t('El error escondido', 'The hidden bug')),
        paragraph(
          t(
            'Aun así, el portátil tardaba 8,6 segundos en aparecer. El culpable era una línea inocente: la función que ajusta el tamaño del canvas también dibujaba un fotograma, y la llamaba antes de `compileAsync`. Ese fotograma compilaba todos los shaders de golpe y bloqueaba la página. Separé “ajustar el tamaño” de “dibujar”, y el portátil pasó a aparecer en 2,4 segundos.',
            'Even so, the laptop took 8.6 seconds to appear. The culprit was an innocent line: the function that resizes the canvas also drew a frame, and I called it before `compileAsync`. That frame compiled every shader at once and blocked the page. I split “resize” from “draw”, and the laptop started appearing in 2.4 seconds.',
          ),
        ),
        heading(t('Sin GPU, una foto', 'No GPU, a photo')),
        paragraph(
          t(
            'Algunos equipos no tienen aceleración gráfica para WebGL, como muchas máquinas virtuales o servidores de pruebas. Ahí WebGL funciona por software a uno o dos fotogramas por segundo. Con `failIfMajorPerformanceCaveat` el navegador me avisa, y en ese caso muestro una foto del portátil y un fondo fijo. Los equipos con GPU ven el 3D completo.',
            'Some devices have no graphics acceleration for WebGL, like many virtual machines or test servers. There WebGL runs in software at one or two frames per second. With `failIfMajorPerformanceCaveat` the browser tells me, and then I show a photo of the laptop and a still background. Devices with a GPU get the full 3D.',
          ),
        ),
        heading(t('Lo que me llevo', 'What I took away')),
        list(
          t(
            [
              'Medir primero: mi sospecha inicial estaba equivocada.',
              'En WebGL, cualquier pregunta a la GPU puede convertirse en una espera.',
              'Separar las funciones que calculan de las que dibujan evita trabajo sorpresa.',
            ],
            [
              'Measure first: my first guess was wrong.',
              'In WebGL, any question to the GPU can turn into a wait.',
              'Keeping functions that calculate apart from functions that draw avoids surprise work.',
            ],
          ),
        ),
      ],
    },
    {
      slug: 'sitio-bilingue-nextjs',
      published: '2026-11-08',
      tags: ['Next.js', 'TypeScript', 'i18n'],
      title: t(
        'Un portafolio en dos idiomas con Next.js, sin librerías',
        'A two-language portfolio with Next.js, no libraries',
      ),
      description: t(
        'Español en la raíz, inglés en /en, el idioma correcto en cada página y cada traducción al lado de su original.',
        'Spanish at the root, English under /en, the right language on every page, and every translation next to its original.',
      ),
      blocks: [
        paragraph(
          t(
            'Quería que mi portafolio se pudiera leer en inglés sin romper los enlaces que ya había compartido en español. Next.js no trae un sistema de idiomas para el App Router, y las librerías que existen resolvían más de lo que necesitaba. Así que lo armé con las piezas del propio framework.',
            "I wanted my portfolio to be readable in English without breaking the links I'd already shared in Spanish. Next.js doesn't ship a language system for the App Router, and the libraries out there solved more than I needed. So I built it from the framework's own pieces.",
          ),
        ),
        heading(t('Dos layouts raíz', 'Two root layouts')),
        paragraph(
          t(
            'El idioma de una página va en `<html lang>`, y ese elemento lo escribe el layout raíz. Con grupos de rutas puedo tener dos: uno para todo lo que está en la raíz y otro para lo que está bajo `/en`. Los grupos no cambian las URL, así que `/proyectos/mercajusto` siguió funcionando y apareció `/en/projects/mercajusto`.',
            "A page's language goes in `<html lang>`, and the root layout writes that element. With route groups I can have two: one for everything at the root and one for everything under `/en`. Groups don't change URLs, so `/proyectos/mercajusto` kept working and `/en/projects/mercajusto` appeared.",
          ),
        ),
        code(
          'text',
          `app/
  (es)/layout.tsx            → <html lang="es">
  (es)/page.tsx              → /
  (es)/proyectos/[slug]/     → /proyectos/mercajusto
  (en)/layout.tsx            → <html lang="en">
  (en)/en/page.tsx           → /en
  (en)/en/projects/[slug]/   → /en/projects/mercajusto`,
        ),
        heading(t('Cada traducción al lado de su original', 'Every translation next to its original')),
        paragraph(
          t(
            'En vez de un archivo de traducciones aparte, el contenido usa una función mínima que recibe las dos versiones:',
            'Instead of a separate translations file, the content uses a tiny function that takes both versions:',
          ),
        ),
        code(
          'ts',
          `export function translator(locale: Locale) {
  return <T,>(es: T, en: T): T => (locale === 'en' ? en : es)
}

const t = translator(locale)
platform: t('App móvil', 'Mobile app')`,
        ),
        paragraph(
          t(
            'Así un proyecto se escribe una sola vez, con sus imágenes y enlaces, y cada texto lleva su par en la misma línea: es difícil olvidar una traducción. Los textos de la interfaz (botones, etiquetas) viven en un diccionario cuyo tipo sale del español: si al inglés le falta una clave, TypeScript no compila.',
            "That way a project is written once, with its images and links, and every string carries its pair on the same line, so a missing translation is hard to miss. Interface copy (buttons, labels) lives in a dictionary whose type comes from the Spanish one: if English is missing a key, TypeScript won't compile.",
          ),
        ),
        heading(t('Que Google entienda los dos', 'Helping Google understand both')),
        list(
          t(
            [
              'Cada página declara su versión en el otro idioma con `hreflang`.',
              'El sitemap lista todas las páginas con sus alternativas.',
              'Cada idioma tiene su propia tarjeta para compartir en redes.',
            ],
            [
              'Every page declares its version in the other language with `hreflang`.',
              'The sitemap lists every page with its alternates.',
              'Each language has its own card for sharing on social media.',
            ],
          ),
        ),
        heading(t('Cambiar de idioma sin perder el lugar', 'Switching language without losing your place')),
        paragraph(
          t(
            'El selector ES · EN calcula la misma página en el otro idioma (`/proyectos/x` ↔ `/en/projects/x`) y, si estás en una sección del inicio, traduce también el ancla: desde `#contacto` llegas a `#contact`. Las funciones que hacen esa traducción son puras y tienen pruebas.',
            'The ES · EN switch works out the same page in the other language (`/proyectos/x` ↔ `/en/projects/x`) and, if you are on a home-page section, translates the anchor too: from `#contacto` you land on `#contact`. The functions doing that are pure and tested.',
          ),
        ),
      ],
    },
  ]

  return articles.sort((a, b) => b.published.localeCompare(a.published))
})

export function getArticle(slug: string, locale: Locale): Article | undefined {
  return getArticles(locale).find((article) => article.slug === slug)
}

/** Reading time at about 200 words a minute, never under one. */
export function readingMinutes(article: Article): number {
  const words = article.blocks
    .flatMap((block) => (block.type === 'list' ? block.items : block.type === 'code' ? [] : [block.text]))
    .join(' ')
    .split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
