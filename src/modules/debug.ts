// ============================================
// Debug System - Interactive Development Tools
// ============================================
// Provides debugging utilities, console commands, and development helpers
// to make iterating and testing easier during development.

import { engine, Transform, MeshRenderer, Material, Color4 } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// ============================================
// Debug Configuration
// ============================================

export interface DebugConfig {
  enabled: boolean
  showFPS: boolean
  showEntityCount: boolean
  showPlayerPosition: boolean
  verboseLogging: boolean
  visualDebugMarkers: boolean
}

const DEBUG_CONFIG: DebugConfig = {
  enabled: true, // Set to false in production
  showFPS: true,
  showEntityCount: true,
  showPlayerPosition: false,
  verboseLogging: true,
  visualDebugMarkers: false,
}

// ============================================
// Performance Monitoring
// ============================================

class PerformanceMonitor {
  private frameCount: number = 0
  private lastFpsUpdate: number = Date.now()
  private currentFPS: number = 0
  private frameTime: number = 0

  update(): void {
    this.frameCount++
    const now = Date.now()
    const elapsed = now - this.lastFpsUpdate

    if (elapsed >= 1000) {
      this.currentFPS = Math.round((this.frameCount * 1000) / elapsed)
      this.frameTime = elapsed / this.frameCount
      this.frameCount = 0
      this.lastFpsUpdate = now
    }
  }

  getFPS(): number {
    return this.currentFPS
  }

  getFrameTime(): number {
    return this.frameTime
  }

  getStats(): string {
    return `FPS: ${this.currentFPS} | Frame Time: ${this.frameTime.toFixed(2)}ms`
  }
}

export const perfMonitor = new PerformanceMonitor()

// ============================================
// Entity Management
// ============================================

class EntityTracker {
  private entityMarkers: Map<number, any> = new Map()

  getEntityCount(): number {
    let count = 0
    for (const [entity] of engine.getEntitiesWith(Transform)) {
      count++
    }
    return count
  }

  listAllEntities(): void {
    console.log('=== Entity List ===')
    let index = 0
    for (const [entity, transform] of engine.getEntitiesWith(Transform)) {
      const pos = transform.position
      console.log(
        `Entity ${index}: ID=${entity} Position=(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`
      )
      index++
    }
    console.log(`Total entities: ${index}`)
  }

  createDebugMarker(position: Vector3, color: Color4 = Color4.Red()): any {
    const marker = engine.addEntity()
    Transform.create(marker, {
      position: position,
      scale: Vector3.create(0.3, 0.3, 0.3),
    })
    MeshRenderer.setSphere(marker)
    Material.setPbrMaterial(marker, {
      albedoColor: color,
      emissiveColor: Color3.fromColor4(color),
      emissiveIntensity: 2,
    })
    return marker
  }

  clearDebugMarkers(): void {
    for (const [id, marker] of this.entityMarkers) {
      engine.removeEntity(marker)
    }
    this.entityMarkers.clear()
    console.log('Debug markers cleared')
  }
}

// Helper to convert Color4 to Color3
function Color3FromColor4(color: Color4): any {
  return {
    r: color.r,
    g: color.g,
    b: color.b,
  }
}

export const entityTracker = new EntityTracker()

// ============================================
// Console Commands System
// ============================================

export class DebugConsole {
  private commands: Map<string, Function> = new Map()

  constructor() {
    this.registerDefaultCommands()
  }

  registerCommand(name: string, fn: Function): void {
    this.commands.set(name.toLowerCase(), fn)
    if (DEBUG_CONFIG.verboseLogging) {
      console.log(`Debug command registered: ${name}`)
    }
  }

  executeCommand(commandString: string): void {
    const parts = commandString.trim().split(' ')
    const commandName = parts[0].toLowerCase()
    const args = parts.slice(1)

    const command = this.commands.get(commandName)
    if (command) {
      try {
        command(...args)
      } catch (error) {
        console.error(`Error executing command '${commandName}':`, error)
      }
    } else {
      console.warn(`Unknown command: ${commandName}. Type 'help' for available commands.`)
    }
  }

  private registerDefaultCommands(): void {
    // Help command
    this.registerCommand('help', () => {
      console.log('=== Available Debug Commands ===')
      console.log('help - Show this help message')
      console.log('fps - Show current FPS')
      console.log('entities - List all entities')
      console.log('count - Show entity count')
      console.log('clear - Clear console')
      console.log('config - Show debug configuration')
      console.log('toggle <setting> - Toggle debug setting')
      console.log('marker <x> <y> <z> - Create debug marker at position')
      console.log('clearmarkers - Remove all debug markers')
      console.log('stats - Show performance statistics')
      console.log('================================')
    })

    // FPS command
    this.registerCommand('fps', () => {
      console.log(`Current FPS: ${perfMonitor.getFPS()}`)
    })

    // Entity list command
    this.registerCommand('entities', () => {
      entityTracker.listAllEntities()
    })

    // Entity count command
    this.registerCommand('count', () => {
      console.log(`Total entities: ${entityTracker.getEntityCount()}`)
    })

    // Clear console
    this.registerCommand('clear', () => {
      console.clear()
      console.log('Console cleared')
    })

    // Show config
    this.registerCommand('config', () => {
      console.log('=== Debug Configuration ===')
      console.log(JSON.stringify(DEBUG_CONFIG, null, 2))
    })

    // Toggle settings
    this.registerCommand('toggle', (setting: string) => {
      if (setting in DEBUG_CONFIG) {
        DEBUG_CONFIG[setting as keyof DebugConfig] = !DEBUG_CONFIG[
          setting as keyof DebugConfig
        ] as any
        console.log(`${setting} is now ${DEBUG_CONFIG[setting as keyof DebugConfig]}`)
      } else {
        console.warn(`Unknown setting: ${setting}`)
      }
    })

    // Create debug marker
    this.registerCommand('marker', (x: string, y: string, z: string) => {
      const position = Vector3.create(parseFloat(x) || 0, parseFloat(y) || 1, parseFloat(z) || 0)
      entityTracker.createDebugMarker(position)
      console.log(`Debug marker created at (${position.x}, ${position.y}, ${position.z})`)
    })

    // Clear markers
    this.registerCommand('clearmarkers', () => {
      entityTracker.clearDebugMarkers()
    })

    // Stats command
    this.registerCommand('stats', () => {
      console.log('=== Performance Statistics ===')
      console.log(perfMonitor.getStats())
      console.log(`Entities: ${entityTracker.getEntityCount()}`)
      console.log('==============================')
    })
  }
}

export const debugConsole = new DebugConsole()

// ============================================
// Global Debug Object (accessible in browser console)
// ============================================

// Make debug tools available globally in development
if (typeof window !== 'undefined' && DEBUG_CONFIG.enabled) {
  ;(window as any).DCL_DEBUG = {
    config: DEBUG_CONFIG,
    perfMonitor: perfMonitor,
    entityTracker: entityTracker,
    console: debugConsole,

    // Shortcuts for common commands
    help: () => debugConsole.executeCommand('help'),
    fps: () => console.log(`FPS: ${perfMonitor.getFPS()}`),
    entities: () => entityTracker.listAllEntities(),
    count: () => console.log(`Entities: ${entityTracker.getEntityCount()}`),
    stats: () => debugConsole.executeCommand('stats'),
    marker: (x: number, y: number, z: number) =>
      debugConsole.executeCommand(`marker ${x} ${y} ${z}`),
    clearmarkers: () => entityTracker.clearDebugMarkers(),

    // Toggle functions
    toggleFPS: () => {
      DEBUG_CONFIG.showFPS = !DEBUG_CONFIG.showFPS
      console.log(`FPS display: ${DEBUG_CONFIG.showFPS}`)
    },
    toggleVerbose: () => {
      DEBUG_CONFIG.verboseLogging = !DEBUG_CONFIG.verboseLogging
      console.log(`Verbose logging: ${DEBUG_CONFIG.verboseLogging}`)
    },
  }

  console.log('🐛 Debug tools loaded! Access via: DCL_DEBUG')
  console.log('   Example: DCL_DEBUG.help()')
  console.log('   Example: DCL_DEBUG.fps()')
  console.log('   Example: DCL_DEBUG.entities()')
}

// ============================================
// Debug System Update Loop
// ============================================

export function initDebugSystem(): void {
  if (!DEBUG_CONFIG.enabled) {
    return
  }

  console.log('🔧 Debug System Initialized')
  console.log('   Type DCL_DEBUG.help() for available commands')

  // Add system for performance monitoring
  engine.addSystem(() => {
    perfMonitor.update()

    // Optional: Print stats periodically
    if (DEBUG_CONFIG.showFPS && perfMonitor.getFPS() > 0) {
      // Could update UI here
    }
  })

  // Log initial stats
  setTimeout(() => {
    console.log('=== Initial Scene Stats ===')
    console.log(`Entities: ${entityTracker.getEntityCount()}`)
    console.log('==========================')
  }, 2000)
}

// ============================================
// Utility Functions
// ============================================

export function logWithTimestamp(message: string, ...args: any[]): void {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
  console.log(`[${timestamp}] ${message}`, ...args)
}

export function logError(error: any, context?: string): void {
  const prefix = context ? `[${context}] ` : ''
  console.error(`❌ ${prefix}Error:`, error)
}

export function logWarning(message: string, context?: string): void {
  const prefix = context ? `[${context}] ` : ''
  console.warn(`⚠️ ${prefix}${message}`)
}

export function logSuccess(message: string, context?: string): void {
  const prefix = context ? `[${context}] ` : ''
  console.log(`✅ ${prefix}${message}`)
}

// ============================================
// Export Config for External Modification
// ============================================

export function getDebugConfig(): DebugConfig {
  return DEBUG_CONFIG
}

export function setDebugEnabled(enabled: boolean): void {
  DEBUG_CONFIG.enabled = enabled
  console.log(`Debug system ${enabled ? 'enabled' : 'disabled'}`)
}
