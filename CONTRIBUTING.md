# Guía de Contribución - Decenterland Parcela

¡Bienvenido! Esta guía te ayudará a contribuir al proyecto de manera efectiva.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ 
- npm 8+
- Decentraland CLI: `npm install -g decentraland`

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/noepab/decenterland-parcela.git
cd decenterland-parcela

# Instalar dependencias
npm install

# Construir el proyecto
npm run build

# Iniciar servidor de desarrollo
npm start
```

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto TypeScript |
| `npm run watch` | Observa cambios y recompila automáticamente |
| `npm run deploy` | Despliega la escena a Decentraland |
| `npm run lint` | Verifica errores de TypeScript |
| `npm run clean` | Limpia archivos de compilación |
| `npm run dev` | Compila y ejecuta en un solo comando |
| `npm run status` | Verifica el estado del proyecto |
| `npm run help` | Muestra todos los comandos disponibles |

## 🏗️ Estructura del Proyecto

```
decenterland-parcela/
├── src/
│   ├── index.ts          # Punto de entrada principal
│   ├── scene.ts          # Configuración de la escena
│   └── modules/          # Módulos funcionales
│       ├── audio.ts      # Sistema de audio
│       ├── building.ts   # Estructura del edificio
│       ├── gallery.ts    # Galería de arte
│       ├── interactives.ts # Elementos interactivos
│       ├── lighting.ts   # Sistema de iluminación
│       ├── materials.ts  # Materiales y texturas
│       └── teleport-ui.ts # Sistema de teletransporte
├── sounds/               # Archivos de audio
├── models/               # Modelos 3D (.glb)
├── scene.json           # Configuración de la escena
├── package.json         # Dependencias y scripts
└── tsconfig.json        # Configuración TypeScript
```

## 🎯 Flujo de Trabajo

### 1. Crear una Rama
```bash
git checkout -b feature/nueva-funcionalidad
```

### 2. Desarrollar
- Edita los archivos en `src/`
- Ejecuta `npm run watch` para compilación automática
- Prueba con `npm start` en el navegador

### 3. Probar
- Verifica que no haya errores: `npm run lint`
- Prueba la escena en el navegador (http://localhost:8000)
- Verifica interacciones y funcionalidades

### 4. Commit y Push
```bash
git add .
git commit -m "feat: descripción de la mejora"
git push origin feature/nueva-funcionalidad
```

### 5. Pull Request
- Crea un PR en GitHub
- Describe los cambios realizados
- Incluye capturas de pantalla si hay cambios visuales

## 📝 Convenciones de Código

### TypeScript
- Usa `const` y `let`, evita `var`
- Nombra funciones descriptivamente
- Comenta código complejo
- Usa tipos explícitos cuando sea posible

### Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, sin cambios de código
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

## 🐛 Depuración

### Console Logs
Añade logs para depuración:
```typescript
console.log('Debug: Valor de la variable:', variable)
```

### Chrome DevTools
1. Abre la escena en Chrome
2. F12 para abrir DevTools
3. Console tab para ver logs
4. Network tab para recursos

### Problemas Comunes

#### Build Falla
```bash
npm run clean
npm install
npm run build
```

#### Escena no se Carga
- Verifica `scene.json` esté correctamente configurado
- Revisa la consola del navegador para errores
- Confirma que todos los archivos estén en `bin/`

#### Modelos no Aparecen
- Verifica la ruta del modelo en el código
- Confirma que el archivo `.glb` exista
- Revisa la escala y posición del modelo

## 🎨 Añadir Nuevas Funcionalidades

### Nuevo Módulo
1. Crea archivo en `src/modules/tu-modulo.ts`
2. Exporta funciones públicas
3. Importa en `src/index.ts` o donde se necesite

```typescript
// src/modules/mi-nuevo-modulo.ts
export function crearElementoInteractivo() {
  // Tu código aquí
}
```

### Nuevo Modelo 3D
1. Coloca el archivo `.glb` en carpeta `models/`
2. Carga con `GltfContainer`:

```typescript
import { GltfContainer } from '@dcl/sdk/ecs'

const entity = engine.addEntity()
GltfContainer.create(entity, {
  src: 'models/mi-modelo.glb'
})
```

### Nuevo Sonido
1. Añade archivo de audio en `sounds/`
2. Reproduce con AudioSource:

```typescript
import { AudioSource } from '@dcl/sdk/ecs'

AudioSource.create(entity, {
  audioClipUrl: 'sounds/mi-sonido.mp3',
  loop: false,
  playing: true
})
```

## 🔍 Testing

### Manual Testing
1. Ejecuta `npm start`
2. Abre http://localhost:8000
3. Prueba todas las interacciones
4. Verifica la consola del navegador
5. Prueba en diferentes navegadores

### Checklist de Testing
- [ ] La escena carga correctamente
- [ ] No hay errores en la consola
- [ ] Todas las interacciones funcionan
- [ ] Los sonidos se reproducen correctamente
- [ ] Los modelos 3D se ven correctamente
- [ ] El rendimiento es aceptable (>30 FPS)

## 📚 Recursos Útiles

- [Decentraland SDK Documentation](https://docs.decentraland.org/)
- [SDK7 Examples](https://github.com/decentraland/sdk7-goerli-plaza)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Blender para Modelos 3D](https://www.blender.org/)

## 💬 Soporte

¿Tienes preguntas? 
- Abre un Issue en GitHub
- Revisa la documentación
- Contacta al equipo de desarrollo

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo LICENSE para más detalles.

---

¡Gracias por contribuir! 🎉
