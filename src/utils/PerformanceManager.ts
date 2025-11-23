export class PerformanceManager {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  constructor() {
    this.startFPSMonitoring();
  }

  /**
   * Detect device performance capabilities
   */
  detectPerformanceLevel(): 'high' | 'medium' | 'low' {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      return 'low';
    }

    const renderer = gl as WebGLRenderingContext;
    const debugInfo = renderer.getExtension('WEBGL_debug_renderer_info');

    // Check GPU capabilities
    const vendor = debugInfo ? renderer.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : '';
    const rendererName = debugInfo ? renderer.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

    // Check device memory
    const memory = (navigator as any).deviceMemory || 4;

    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;

    // Check screen resolution
    const pixelCount = window.screen.width * window.screen.height;

    let score = 0;

    // GPU scoring
    if (vendor.includes('NVIDIA') || vendor.includes('AMD') || vendor.includes('Intel')) {
      score += 3;
    } else {
      score += 1;
    }

    // Memory scoring (4GB baseline)
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;

    // CPU scoring
    if (cores >= 8) score += 3;
    else if (cores >= 4) score += 2;
    else score += 1;

    // Screen resolution scoring
    if (pixelCount >= 1920 * 1080) score += 2;
    else if (pixelCount >= 1280 * 720) score += 1;

    // Mobile detection (reduce score for mobile)
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      score -= 2;
    }

    // Determine performance level
    if (score >= 9) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }

  /**
   * Monitor FPS for dynamic performance adjustment
   */
  private startFPSMonitoring() {
    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();

      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fps;
  }

  /**
   * Check if performance is good enough for current quality
   */
  isPerformanceAcceptable(targetFPS = 30): boolean {
    return this.fps >= targetFPS;
  }

  /**
   * Get recommended quality settings based on current performance
   */
  getRecommendedQuality(): {
    particleCount: number;
    shadowQuality: number;
    antiAliasing: boolean;
    pixelRatio: number;
    textureQuality: number;
  } {
    const performanceLevel = this.detectPerformanceLevel();

    switch (performanceLevel) {
      case 'high':
        return {
          particleCount: 1000,
          shadowQuality: 2048,
          antiAliasing: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          textureQuality: 2048
        };

      case 'medium':
        return {
          particleCount: 500,
          shadowQuality: 1024,
          antiAliasing: true,
          pixelRatio: 1.5,
          textureQuality: 1024
        };

      case 'low':
        return {
          particleCount: 200,
          shadowQuality: 512,
          antiAliasing: false,
          pixelRatio: 1,
          textureQuality: 512
        };

      default:
        return {
          particleCount: 500,
          shadowQuality: 1024,
          antiAliasing: true,
          pixelRatio: 1,
          textureQuality: 1024
        };
    }
  }

  /**
   * Create a performance-optimized material
   */
  createOptimizedMaterial(type: 'standard' | 'basic' | 'phong', options: any = {}) {
    const performanceLevel = this.detectPerformanceLevel();

    if (performanceLevel === 'low' && type === 'standard') {
      type = 'basic';
    }

    switch (type) {
      case 'basic':
        return new (THREE as any).MeshBasicMaterial({
          ...options,
          // Reduce complex features on low-end
          ...(performanceLevel === 'low' && {
            transparent: false,
            alphaTest: 0
          })
        });

      case 'phong':
        return new (THREE as any).MeshPhongMaterial({
          ...options,
          shininess: performanceLevel === 'low' ? 10 : 30
        });

      case 'standard':
      default:
        return new (THREE as any).MeshStandardMaterial({
          ...options,
          roughness: performanceLevel === 'low' ? 0.8 : 0.5,
          metalness: performanceLevel === 'low' ? 0.1 : 0.3
        });
    }
  }
}