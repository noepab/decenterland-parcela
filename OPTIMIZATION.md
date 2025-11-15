# Guía de Optimización y Performance

Esta guía proporciona técnicas y mejores prácticas para optimizar el rendimiento de tu escena en Decentraland.

## 📊 Límites Técnicos de Decentraland

### Límites por Parcela (16x16m)

| Recurso | Límite 1x1 | Límite 2x2 | Límite 4x4 |
|---------|-----------|-----------|-----------|
| **Triángulos** | 10,000 | 20,000 | 40,000 |
| **Materiales** | 20 | 40 | 80 |
| **Texturas** | 10 MB | 20 MB | 40 MB |
| **Archivos de Audio** | 10 MB | 20 MB | 40 MB |
| **Entidades** | ~200 | ~400 | ~800 |
| **Altura máxima** | 20 m | 20 m | 20 m |

### Límites de Archivos

- **Texturas**: Max 512x512 (recomendado), hasta 2048x2048
- **Modelos 3D**: Preferir .glb sobre .gltf
- **Audio**: MP3 o OGG, máx 5 MB por archivo
- **Scripts**: Sin límite, pero evitar operaciones costosas

## 🚀 Optimización de Modelos 3D

### 1. Reducción de Polígonos

```bash
# Usar Blender para reducir polígonos
# Edit Mode > Face > Triangulate Faces
# Modifier > Decimate
```

**Recomendaciones**:
- Edificios simples: 500-2,000 triángulos
- Props pequeños: 100-500 triángulos
- Personajes: 1,000-5,000 triángulos
- Objetos detallados: max 10,000 triángulos

### 2. Optimización de Geometría

```typescript
// ✅ BUENO: Reutilizar meshes
const boxMesh = MeshRenderer.setBox(entity1)
MeshRenderer.setBox(entity2) // Reutiliza internamente

// ❌ MALO: Modelos muy complejos
// No uses modelos con millones de triángulos
```

### 3. LOD (Level of Detail)

```typescript
import { Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

function updateLOD(entity: any, playerPosition: Vector3) {
  const transform = Transform.get(entity)
  const distance = Vector3.distance(transform.position, playerPosition)
  
  if (distance > 20) {
    // Ocultar o reducir detalle
    transform.scale = Vector3.Zero()
  } else if (distance > 10) {
    // Modelo de baja calidad
    GltfContainer.createOrReplace(entity, {
      src: 'models/low-poly.glb'
    })
  } else {
    // Modelo de alta calidad
    GltfContainer.createOrReplace(entity, {
      src: 'models/high-poly.glb'
    })
  }
}
```

## 🎨 Optimización de Texturas

### 1. Tamaño de Texturas

```
Recomendado:
- UI Elements: 128x128, 256x256
- Props: 256x256, 512x512
- Paredes/Pisos: 512x512, 1024x1024
- Terreno: 1024x1024

Evitar:
- 4096x4096 o mayor (muy pesado)
- Tamaños no potencia de 2 (ej: 300x400)
```

### 2. Compresión de Texturas

```bash
# Usar herramientas de compresión
# PNG: TinyPNG, OptiPNG
# JPG: JPEGmini, ImageOptim

# Convertir a formatos eficientes
ffmpeg -i input.png -vcodec png output.png
```

### 3. Atlas de Texturas

```typescript
// Combinar múltiples texturas en una sola
// Reduce draw calls y mejora performance

// ✅ BUENO: Una textura para múltiples objetos
Material.setPbrMaterial(entity, {
  texture: {
    src: 'textures/combined-atlas.png'
  }
})

// ❌ MALO: Una textura por objeto pequeño
// Esto crea muchos draw calls
```

### 4. Compartir Materiales

```typescript
// ✅ BUENO: Reutilizar materiales
const sharedMaterial = {
  albedoColor: Color4.White(),
  roughness: 0.5,
  metallic: 0
}

Material.setPbrMaterial(entity1, sharedMaterial)
Material.setPbrMaterial(entity2, sharedMaterial)

// ❌ MALO: Crear material único para cada entidad
```

## 🔊 Optimización de Audio

### 1. Formato y Calidad

```
Recomendado:
- Formato: MP3 (mejor compresión) u OGG
- Bitrate: 128 kbps para efectos, 192 kbps para música
- Sample rate: 44.1 kHz

Evitar:
- WAV sin comprimir
- Bitrates > 256 kbps
- Sample rates > 48 kHz
```

### 2. Audio Espacial

```typescript
import { AudioSource } from '@dcl/sdk/ecs'

// ✅ BUENO: Audio con falloff espacial
AudioSource.create(entity, {
  audioClipUrl: 'sounds/ambient.mp3',
  loop: true,
  playing: true,
  volume: 0.5,
  // Audio se escucha solo cerca
})

// Detener audio cuando está lejos
function updateAudioDistance(entity: any, playerPosition: Vector3) {
  const transform = Transform.get(entity)
  const distance = Vector3.distance(transform.position, playerPosition)
  
  const audioSource = AudioSource.getMutable(entity)
  if (distance > 20) {
    audioSource.playing = false
  } else {
    audioSource.playing = true
  }
}
```

### 3. Lazy Loading de Audio

```typescript
// No cargar todos los sonidos al inicio
// Cargarlos solo cuando se necesiten

function playSoundOnDemand(soundPath: string) {
  const entity = engine.addEntity()
  AudioSource.create(entity, {
    audioClipUrl: soundPath,
    playing: true,
    loop: false
  })
  
  // Limpiar después de que termine
  setTimeout(() => {
    engine.removeEntity(entity)
  }, 5000)
}
```

## 💻 Optimización de Código

### 1. Evitar Cálculos Innecesarios

```typescript
// ❌ MALO: Calcular cada frame
engine.addSystem(() => {
  const expensiveResult = complexCalculation() // Se ejecuta 60 veces por segundo!
  updateEntity(expensiveResult)
})

// ✅ BUENO: Calcular solo cuando cambie
let cachedResult: any = null
let lastUpdate = 0

engine.addSystem(() => {
  const now = Date.now()
  if (now - lastUpdate > 1000) { // Solo cada segundo
    cachedResult = complexCalculation()
    lastUpdate = now
  }
  updateEntity(cachedResult)
})
```

### 2. Pooling de Entidades

```typescript
// Reutilizar entidades en lugar de crear/destruir constantemente

class EntityPool {
  private pool: any[] = []
  
  get(): any {
    if (this.pool.length > 0) {
      return this.pool.pop()
    }
    return engine.addEntity()
  }
  
  return(entity: any): void {
    // Resetear entity
    Transform.createOrReplace(entity, {
      position: Vector3.create(0, -100, 0), // Ocultar
      scale: Vector3.Zero()
    })
    this.pool.push(entity)
  }
}

const bulletPool = new EntityPool()

// Usar
const bullet = bulletPool.get()
// ... usar bullet ...
bulletPool.return(bullet)
```

### 3. Debouncing y Throttling

```typescript
// Limitar frecuencia de eventos

function debounce(fn: Function, delay: number) {
  let timeoutId: any
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

function throttle(fn: Function, limit: number) {
  let inThrottle: boolean
  return (...args: any[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Uso
const onPlayerMove = throttle((position: Vector3) => {
  console.log('Player moved to:', position)
}, 1000) // Max una vez por segundo
```

### 4. Evitar Bucles Infinitos

```typescript
// ❌ MALO: Puede causar freeze
while (true) {
  // Esto bloqueará el juego!
}

// ✅ BUENO: Usar sistemas con límites
let iterations = 0
const maxIterations = 100

engine.addSystem(() => {
  if (iterations < maxIterations) {
    // Hacer algo
    iterations++
  }
})
```

## 📈 Monitoreo de Performance

### 1. FPS Counter

```typescript
// Ya implementado en src/modules/progress.ts
import { initProgressSystem } from './modules/progress'

initProgressSystem() // Muestra FPS en pantalla
```

### 2. Entity Counter

```typescript
// Contar entidades activas
function countEntities(): number {
  let count = 0
  for (const [entity] of engine.getEntitiesWith(Transform)) {
    count++
  }
  return count
}

console.log('Total entities:', countEntities())
```

### 3. Performance Profiling

```typescript
// Medir tiempo de ejecución
function profileFunction(fn: Function, label: string) {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${label} took ${(end - start).toFixed(2)}ms`)
}

profileFunction(() => {
  // Código a medir
}, 'Complex Operation')
```

### 4. Memory Usage

```typescript
// Verificar uso de memoria (en navegador)
if (typeof window !== 'undefined' && (performance as any).memory) {
  const memory = (performance as any).memory
  console.log('Memory used:', (memory.usedJSHeapSize / 1048576).toFixed(2), 'MB')
  console.log('Memory limit:', (memory.jsHeapSizeLimit / 1048576).toFixed(2), 'MB')
}
```

## ✅ Checklist de Optimización

### Pre-deploy

- [ ] Modelos 3D optimizados (< 10k triángulos)
- [ ] Texturas comprimidas y tamaño apropiado
- [ ] Audio comprimido (MP3/OGG, < 5MB cada uno)
- [ ] Materiales reutilizados cuando sea posible
- [ ] Sin bucles infinitos o cálculos costosos en sistemas
- [ ] Entity pooling para objetos dinámicos
- [ ] LOD implementado para objetos lejanos
- [ ] Audio espacial configurado correctamente
- [ ] Sin console.logs innecesarios
- [ ] FPS consistente > 30

### Testing

```bash
# 1. Verificar build
npm run build

# 2. Probar localmente
npm start

# 3. Verificar en navegador
# - Abrir DevTools (F12)
# - Ver Console para errores
# - Network tab para assets pesados
# - Performance tab para profiling

# 4. Verificar FPS
# - Debe ser > 30 FPS constante
# - Verificar con DCL_DEBUG.fps()

# 5. Verificar entity count
# - Debe ser < 200 para 1x1 parcela
# - Verificar con DCL_DEBUG.count()
```

## 🛠️ Herramientas Recomendadas

### Optimización de Modelos 3D
- **Blender**: Modelado y reducción de polígonos
- **Decimate Modifier**: Reducir triángulos automáticamente
- **UV Mapping**: Optimizar uso de texturas

### Optimización de Texturas
- **TinyPNG**: Comprimir PNG
- **JPEGmini**: Comprimir JPG
- **ImageMagick**: Batch processing
- **Texture Packer**: Crear atlas de texturas

### Optimización de Audio
- **Audacity**: Editar y comprimir audio
- **FFmpeg**: Conversión y compresión batch
- **Online Audio Converter**: Conversión rápida

### Análisis de Performance
- **Chrome DevTools**: Profiling y debugging
- **Decentraland Inspector**: Visual debugging (press I)
- **Stats.js**: Monitor FPS en tiempo real

## 📚 Mejores Prácticas Resumidas

1. **Mantén el triangle count bajo**: < 10k por parcela
2. **Reutiliza recursos**: Materiales, texturas, geometrías
3. **Usa LOD**: Reduce detalle con la distancia
4. **Comprime assets**: Texturas, audio, modelos
5. **Evita cálculos costosos**: Cache resultados
6. **Pool entities**: Reutiliza en lugar de crear/destruir
7. **Limita sistemas activos**: Solo los necesarios
8. **Monitorea performance**: FPS, entities, memoria
9. **Test en diferentes dispositivos**: PC, laptop, móvil
10. **Profile antes de deploy**: Identifica cuellos de botella

## 🔍 Debugging de Performance Issues

### Problema: FPS Bajo

**Posibles causas**:
1. Demasiados triángulos
2. Texturas muy grandes
3. Muchas entidades
4. Cálculos costosos en sistemas
5. Demasiados draw calls

**Soluciones**:
```typescript
// 1. Reducir triángulos
// Usar modelos low-poly

// 2. Optimizar texturas
// Reducir tamaño a 512x512 o menos

// 3. Reducir entidades
console.log('Entities:', DCL_DEBUG.count())
// Si > 200, eliminar algunas

// 4. Optimizar sistemas
// Limitar frecuencia de actualización

// 5. Combinar materiales
// Usar material atlas
```

### Problema: Carga Lenta

**Posibles causas**:
1. Assets muy pesados
2. Muchos archivos externos
3. Modelos sin optimizar

**Soluciones**:
- Comprimir todos los assets
- Combinar texturas en atlas
- Usar formatos eficientes (.glb, .mp3)
- Lazy loading de recursos no críticos

### Problema: Memory Leaks

**Posibles causas**:
1. Entities no eliminadas
2. Event listeners no removidos
3. Referencias circulares

**Soluciones**:
```typescript
// Siempre limpiar entities
engine.removeEntity(entity)

// Limpiar systems cuando no se usen
engine.removeSystem(systemId)

// Usar WeakMap para referencias
const entityData = new WeakMap()
```

## 📞 Soporte

Si después de optimizar sigues teniendo problemas de performance:

1. Revisa [Decentraland Performance Guide](https://docs.decentraland.org/creator/development-guide/performance-optimization/)
2. Pregunta en [Decentraland Discord](https://dcl.gg/discord)
3. Abre un issue con detalles específicos

---

**Recuerda**: La optimización es un proceso iterativo. Mide, optimiza, y mide de nuevo.
