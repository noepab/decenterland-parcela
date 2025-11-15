# 🚀 Quick Start Guide - Decenterland Parcela

Guía rápida para empezar a trabajar con el proyecto en minutos.

## ⚡ Inicio Rápido (3 pasos)

```bash
# 1. Clonar e instalar
git clone https://github.com/noepab/decenterland-parcela.git
cd decenterland-parcela
npm install

# 2. Compilar
npm run build

# 3. Ejecutar
npm start
```

Abre tu navegador en: http://localhost:8000

¡Listo! 🎉

## 📋 Prerequisitos

### Instalar Node.js

**Windows/Mac**:
- Descargar de: https://nodejs.org/
- Versión recomendada: 18 LTS o superior

**Linux**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verificar instalación:
```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar 8.x.x o superior
```

### Instalar Decentraland CLI

```bash
npm install -g decentraland
```

Verificar:
```bash
dcl --version
```

## 🎯 Primeros Pasos

### 1. Explorar el Proyecto

```bash
# Ver estructura del proyecto
ls -la

# Archivos importantes:
# - src/index.ts       : Punto de entrada principal
# - scene.json         : Configuración de la escena
# - package.json       : Dependencias y scripts
# - README.md          : Información del proyecto
```

### 2. Comandos Básicos

```bash
# Compilar el proyecto
npm run build

# Iniciar servidor de desarrollo
npm start

# Compilar automáticamente al guardar
npm run watch

# Ver comandos disponibles
npm run help

# Verificar estado del proyecto
npm run status

# Limpiar y reinstalar
npm run clean
npm install
```

### 3. Abrir en el Navegador

1. Ejecuta `npm start`
2. Abre http://localhost:8000
3. ¡Explora la escena!

**Controles**:
- `W,A,S,D` - Mover
- `Mouse` - Mirar alrededor
- `E` - Interactuar
- `Space` - Saltar
- `C` - Agacharse

## 🛠️ Desarrollo

### Hacer tu Primera Modificación

**Ejemplo 1: Cambiar Color de un Objeto**

1. Abre `src/index.ts`
2. Busca `COLOR_PALETTE`
3. Cambia el color azul:

```typescript
const COLOR_PALETTE = {
  blue: Color4.create(1, 0, 0, 1), // Cambiar a rojo
  // ... resto de colores
}
```

4. Guarda el archivo
5. Ejecuta `npm run build`
6. Recarga el navegador
7. ¡El objeto ahora es rojo! 🔴

**Ejemplo 2: Añadir un Cubo**

1. Abre `src/index.ts`
2. Añade al final del archivo `setupScene()`:

```typescript
// Crear un cubo verde
const myCube = engine.addEntity()
Transform.create(myCube, {
  position: Vector3.create(2, 1, 2),
  scale: Vector3.create(1, 1, 1)
})
MeshRenderer.setBox(myCube)
Material.setPbrMaterial(myCube, {
  albedoColor: Color4.Green()
})
```

3. Guarda, compila y recarga
4. ¡Ahora hay un cubo verde! 🟩

### Desarrollo Iterativo

**Modo Watch** (recomendado):

```bash
# Terminal 1: Compilación automática
npm run watch

# Terminal 2: Servidor de desarrollo
npm start

# Ahora edita archivos y se recompilan automáticamente
# Solo necesitas recargar el navegador
```

## 🎨 Ejemplos Rápidos

### Añadir un Modelo 3D

```typescript
import { GltfContainer } from '@dcl/sdk/ecs'

const model = engine.addEntity()
GltfContainer.create(model, {
  src: 'models/mi-modelo.glb' // Tu archivo .glb
})
Transform.create(model, {
  position: Vector3.create(0, 0, 0),
  scale: Vector3.create(1, 1, 1)
})
```

### Añadir Sonido

```typescript
import { AudioSource } from '@dcl/sdk/ecs'

const soundEntity = engine.addEntity()
AudioSource.create(soundEntity, {
  audioClipUrl: 'sounds/mi-sonido.mp3',
  playing: true,
  loop: true,
  volume: 0.5
})
```

### Hacer Algo Clickeable

```typescript
import { PointerEvents, PointerEventType } from '@dcl/sdk/ecs'

PointerEvents.create(entity, {
  pointerEvents: [{
    eventType: PointerEventType.PET_DOWN,
    eventInfo: {
      button: 'PRIMARY',
      hoverText: 'Click aquí',
      callback: () => {
        console.log('¡Clickeado!')
        showNotification('¡Has clickeado el objeto!')
      }
    }
  }]
})
```

### Animar un Objeto

```typescript
let angle = 0

engine.addSystem((dt) => {
  angle += dt
  
  const transform = Transform.getMutable(entity)
  transform.rotation = Quaternion.fromEulerDegrees(0, angle * 50, 0)
})
```

## 🐛 Debugging

### Herramientas de Debug Incluidas

**En el navegador** (después de `npm start`):

```javascript
// Abrir consola (F12) y probar:

// Ver FPS
DCL_DEBUG.fps()

// Listar entidades
DCL_DEBUG.entities()

// Contar entidades
DCL_DEBUG.count()

// Mostrar estadísticas
DCL_DEBUG.stats()

// Crear marcador de debug en posición
DCL_DEBUG.marker(0, 1, 0)

// Limpiar marcadores
DCL_DEBUG.clearmarkers()

// Ver comandos disponibles
DCL_DEBUG.help()
```

### Mostrar Notificaciones en la Escena

```javascript
// En la consola del navegador:
DCL_PROGRESS.showNotification('Mi mensaje', 5) // 5 segundos
```

### Logs en Código

```typescript
console.log('Info:', value)
console.warn('Advertencia:', warning)
console.error('Error:', error)
```

## 🔧 Troubleshooting

### Problema: `npm install` falla

**Solución**:
```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Problema: `npm start` no funciona

**Síntomas**: Error de comando no encontrado

**Solución**:
```bash
# Instalar Decentraland CLI globalmente
npm install -g decentraland

# Verificar
dcl --version
```

### Problema: Escena no se ve en el navegador

**Verificar**:

1. ¿Se compiló correctamente?
```bash
npm run build
# Debe completar sin errores
```

2. ¿El servidor está corriendo?
```bash
npm start
# Debe mostrar: "Server running on http://localhost:8000"
```

3. ¿Hay errores en la consola del navegador?
- Presiona F12
- Ve a la pestaña Console
- Lee los errores

### Problema: Cambios no se ven

**Solución**:
```bash
# 1. Recompilar
npm run build

# 2. Limpiar cache del navegador
# Chrome: Ctrl+Shift+Delete > Clear cache

# 3. Hacer hard reload
# Chrome: Ctrl+Shift+R (Cmd+Shift+R en Mac)
```

### Problema: FPS bajo

**Soluciones**:

1. Verificar entidades:
```javascript
DCL_DEBUG.count() // Debe ser < 200
```

2. Ver guía de optimización:
```bash
# Leer OPTIMIZATION.md
cat OPTIMIZATION.md
```

3. Revisar modelos 3D:
- Deben tener < 10,000 triángulos
- Usar herramientas de simplificación

### Problema: Audio no se escucha

**Verificar**:

1. ¿El archivo existe?
```bash
ls sounds/mi-sonido.mp3
```

2. ¿El formato es correcto?
- Usar: MP3 o OGG
- Evitar: WAV sin comprimir

3. ¿El volumen está configurado?
```typescript
AudioSource.create(entity, {
  audioClipUrl: 'sounds/mi-sonido.mp3',
  volume: 1.0, // 0.0 a 1.0
  playing: true
})
```

## 📚 Recursos Adicionales

### Documentación

- **CONTRIBUTING.md**: Guía completa de contribución
- **DEVELOPMENT.md**: Arquitectura y patrones
- **OPTIMIZATION.md**: Guía de optimización
- **CHANGELOG.md**: Historial de cambios

### Módulos Incluidos

El proyecto incluye módulos útiles en `src/modules/`:

1. **debug.ts**: Sistema de debugging
   ```typescript
   import { initDebugSystem } from './modules/debug'
   initDebugSystem()
   ```

2. **progress.ts**: Indicadores visuales
   ```typescript
   import { initProgressSystem, showNotification } from './modules/progress'
   initProgressSystem()
   showNotification('Hola!')
   ```

3. **utils.ts**: Utilidades generales
   ```typescript
   import { EntityFactory, MathUtils } from './modules/utils'
   const box = EntityFactory.createBox(Vector3.create(0,1,0))
   ```

### Comandos Útiles

```bash
# Ver logs de Git
git log --oneline

# Ver diferencias
git diff

# Ver estado
git status

# Crear nueva rama
git checkout -b feature/mi-feature

# Ver branches
git branch -a
```

## 🎓 Tutoriales Paso a Paso

### Tutorial 1: Crear un Botón Interactivo

1. Crear archivo `src/my-button.ts`:

```typescript
import { engine, Transform, MeshRenderer, Material, PointerEvents, PointerEventType } from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'

export function createButton(position: Vector3, text: string, onClick: () => void) {
  const button = engine.addEntity()
  
  Transform.create(button, {
    position,
    scale: Vector3.create(1, 0.5, 0.2)
  })
  
  MeshRenderer.setBox(button)
  
  Material.setPbrMaterial(button, {
    albedoColor: Color4.Blue()
  })
  
  PointerEvents.create(button, {
    pointerEvents: [{
      eventType: PointerEventType.PET_DOWN,
      eventInfo: {
        button: 'PRIMARY',
        hoverText: text,
        callback: onClick
      }
    }]
  })
  
  return button
}
```

2. En `src/index.ts`, importar y usar:

```typescript
import { createButton } from './my-button'

// En setupScene():
createButton(
  Vector3.create(0, 1.5, 3),
  'Click Me!',
  () => {
    console.log('Button clicked!')
  }
)
```

3. Compilar y probar:
```bash
npm run build
npm start
```

### Tutorial 2: Sistema de Teleport

```typescript
import { Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export function teleportPlayer(position: Vector3) {
  // Nota: En SDK7, necesitas usar movePlayerTo
  console.log('Teleporting to:', position)
  // Implementación depende de API de player
}

// Crear botón de teleport
createButton(
  Vector3.create(2, 0.5, 2),
  'Teleport',
  () => {
    teleportPlayer(Vector3.create(8, 0, 8))
  }
)
```

## 💡 Tips y Trucos

1. **Usa npm run watch**: Compilación automática
2. **F12 siempre abierto**: Ver errores en tiempo real
3. **Console.log es tu amigo**: Debug frecuentemente
4. **Guarda seguido**: Evita perder trabajo
5. **Git commit frecuente**: Historial detallado
6. **Lee los errores**: TypeScript te ayuda
7. **Usa el inspector**: Presiona `I` en la escena
8. **Prueba en diferentes navegadores**: Chrome, Firefox
9. **Optimiza desde el inicio**: Más fácil que después
10. **Consulta la documentación**: Cuando tengas dudas

## 📞 Soporte

¿Necesitas ayuda?

1. **Documentación**: Lee CONTRIBUTING.md y DEVELOPMENT.md
2. **Ejemplos**: Mira el código existente en src/
3. **Community**: [Decentraland Discord](https://dcl.gg/discord)
4. **Docs oficiales**: https://docs.decentraland.org/
5. **Issues**: Abre un issue en GitHub

## 🎉 ¡Feliz Desarrollo!

Ahora estás listo para crear experiencias increíbles en Decentraland.

**Siguiente paso**: Lee CONTRIBUTING.md para conocer el flujo de trabajo completo.

---

Made with ❤️ by AutoGestionPro Team
