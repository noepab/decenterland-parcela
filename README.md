# AutoGestionPro HQ - Decentraland

Edificio futurista de 5 pisos en Decentraland con IA, drone y experiencias interactivas.

## 🚀 Inicio Rápido

```bash
# Clonar e instalar
git clone https://github.com/noepab/decenterland-parcela.git
cd decenterland-parcela
npm install

# Compilar y ejecutar
npm run build
npm start
```

Abre http://localhost:8000 en tu navegador. ¡Listo! 🎉

📖 **Guía completa**: Ver [QUICKSTART.md](QUICKSTART.md)

## 📋 Información del Proyecto

- **Parcela:** -51,144
- **Tamaño:** 1x1
- **SDK:** Decentraland SDK 7
- **Temática:** Oficinas futuristas con tecnología avanzada

## 🏢 Estructura del Edificio

- **Planta Baja:** Recepción con humanoide IA
- **Piso 1-2:** Oficinas AGP 
- **Piso 3:** Galería de arte + Snack-bar
- **Azotea:** Drone biplaza animado

## 🎮 Interacciones

- **Recepcionista:** Click para diálogo de bienvenida
- **Ascensor:** Transporte entre pisos
- **Drone:** Vuelo automático con sonido
- **Galería:** Arte interactivo
- **Elementos clickeables:** Múltiples puntos de interacción

## 🔊 Audio Incluido

- Música ambiental en galería
- Sonidos de drone y ascensor
- Voz del recepcionista
- Efectos del letrero LED

## 🛠️ Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto |
| `npm run watch` | Observa cambios y recompila |
| `npm run deploy` | Despliega a Decentraland |
| `npm run clean` | Limpia archivos de compilación |
| `npm run lint` | Verifica TypeScript |
| `npm run dev` | Compila y ejecuta |
| `npm run status` | Verifica estado del proyecto |
| `npm run help` | Muestra todos los comandos |

## 🐛 Herramientas de Desarrollo

### Debug Console (en el navegador)

Después de ejecutar `npm start`, abre la consola del navegador (F12) y usa:

```javascript
// Ver FPS actual
DCL_DEBUG.fps()

// Listar todas las entidades
DCL_DEBUG.entities()

// Contar entidades
DCL_DEBUG.count()

// Mostrar estadísticas completas
DCL_DEBUG.stats()

// Crear marcador de debug
DCL_DEBUG.marker(0, 1, 0)

// Ver ayuda
DCL_DEBUG.help()
```

### Visual Indicators

```javascript
// Mostrar notificación en la escena
DCL_PROGRESS.showNotification('¡Hola!', 3)

// Toggle FPS counter
DCL_PROGRESS.toggleFPSCounter()
```

### Utilidades

```javascript
// Crear objetos fácilmente
DCL_UTILS.Entity.createBox(position, scale, color)

// Animaciones
DCL_UTILS.Animation.bounce(entity, height, amplitude, speed)

// Y muchas más...
```

## 📚 Documentación

### Para Empezar
- **[QUICKSTART.md](QUICKSTART.md)** - Guía de inicio rápido
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Cómo contribuir al proyecto

### Desarrollo
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Arquitectura y patrones de diseño
- **[OPTIMIZATION.md](OPTIMIZATION.md)** - Guía de optimización y performance

### Referencia
- **[CHANGELOG.md](CHANGELOG.md)** - Historial de cambios y mejoras
- **[MEJORAS.md](MEJORAS.md)** - Mejoras específicas implementadas

## 🎯 Características Principales

### ✨ Sistema de Animación Avanzado
- Movimiento circular en plano XZ
- Variación de altura con onda sinusoidal
- Aceleración por click
- Rotación en eje propio
- Cambio de color dinámico

### 🖥️ Pantallas LED Dinámicas (Mejora #1)
- Pantalla principal en fachada (6x2m)
- Mensajes rotativos cada 5 segundos
- Contador de visitantes simulado
- Modo nocturno con mayor brillo
- Material emisivo AGP (Color: #00CCF0)

### 🛠️ Herramientas de Desarrollo (Mejoras #2-10)
1. ✅ Scripts npm mejorados
2. ✅ Guía de contribución completa
3. ✅ Sistema de tracking de cambios
4. ✅ Documentación de desarrollo
5. ✅ Sistema de debugging interactivo
6. ✅ Indicadores visuales de progreso
7. ✅ Utilidades de testing
8. ✅ Guía de optimización
9. ✅ Quick start mejorado
10. ✅ Sistema de configuración

## 📁 Estructura del Proyecto

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
│       ├── teleport-ui.ts # Sistema de teletransporte
│       ├── debug.ts      # 🆕 Sistema de debugging
│       ├── progress.ts   # 🆕 Indicadores visuales
│       └── utils.ts      # 🆕 Utilidades generales
├── sounds/               # Archivos de audio
├── models/               # Modelos 3D (.glb)
├── *.md                  # 🆕 Documentación completa
├── scene.json           # Configuración de la escena
├── package.json         # Dependencias y scripts
└── tsconfig.json        # Configuración TypeScript
```

## 🎨 Próximas Mejoras Planeadas

- [ ] Sistema de iluminación nocturna dinámica
- [ ] Jardín vertical con plantas interactivas
- [ ] Puertas automáticas con sensores
- [ ] Panel de control administrativo
- [ ] Sistema de chat integrado
- [ ] Multiplayer interactions mejoradas
- [ ] Sistema de achievements
- [ ] Integración con APIs externas
- [ ] Dashboard de estadísticas
- [ ] VR/AR support

Ver [CHANGELOG.md](CHANGELOG.md) para el roadmap completo.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer el proceso.

## 📜 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Soporte

- **Issues**: Abre un issue en GitHub
- **Discord**: [Decentraland Community](https://dcl.gg/discord)
- **Docs**: https://docs.decentraland.org/

---

Desarrollado con ❤️ por AutoGestionPro - Gestión empresarial del futuro 