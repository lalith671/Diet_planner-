export interface DeviceCapabilities {
  webgl2: boolean;
  webxr: boolean;
  maxTextureSize: number;
  gpuMemory: number;
  performanceLevel: 'high' | 'medium' | 'low';
  isMobile: boolean;
  isVR: boolean;
  audioContext: boolean;
  speechSynthesis: boolean;
  camera: boolean;
}

export class DeviceCapabilitiesDetector {
  private static instance: DeviceCapabilitiesDetector;
  private capabilities: DeviceCapabilities | null = null;

  static getInstance(): DeviceCapabilitiesDetector {
    if (!DeviceCapabilitiesDetector.instance) {
      DeviceCapabilitiesDetector.instance = new DeviceCapabilitiesDetector();
    }
    return DeviceCapabilitiesDetector.instance;
  }

  async detectCapabilities(): Promise<DeviceCapabilities> {
    if (this.capabilities) {
      return this.capabilities;
    }

    // Check WebGL2 support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const webgl2 = !!gl;

    // Check WebXR support
    const webxr = 'xr' in navigator && !!(navigator as any).xr?.isSessionSupported;

    // Get max texture size
    let maxTextureSize = 1024;
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }

    // Estimate GPU memory (simplified)
    const gpuMemory = this.estimateGPUMemory(gl);

    // Detect performance level
    const performanceLevel = this.detectPerformanceLevel();

    // Detect mobile device
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Detect VR capabilities
    const isVR = await this.detectVRCapabilities();

    // Check audio capabilities
    const audioContext = 'AudioContext' in window || 'webkitAudioContext' in window;
    const speechSynthesis = 'speechSynthesis' in window;

    // Check camera access
    const camera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

    this.capabilities = {
      webgl2,
      webxr,
      maxTextureSize,
      gpuMemory,
      performanceLevel,
      isMobile,
      isVR,
      audioContext,
      speechSynthesis,
      camera
    };

    return this.capabilities;
  }

  private detectPerformanceLevel(): 'high' | 'medium' | 'low' {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      return 'low';
    }

    let score = 0;

    // Check GPU vendor
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

      // High-end GPUs
      if (vendor.includes('NVIDIA') || vendor.includes('AMD') || vendor.includes('ATI')) {
        score += 3;
      } else if (vendor.includes('Intel')) {
        score += 2;
      } else {
        score += 1;
      }

      // Check for mobile GPU indicators
      if (renderer.includes('Mali') || renderer.includes('Adreno') || renderer.includes('PowerVR')) {
        score -= 1;
      }
    }

    // Check device memory
    const memory = (navigator as any).deviceMemory || 4;
    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;

    // Check CPU cores
    const cores = navigator.hardwareConcurrency || 4;
    if (cores >= 8) score += 3;
    else if (cores >= 4) score += 2;
    else score += 1;

    // Check screen resolution
    const pixelCount = window.screen.width * window.screen.height;
    if (pixelCount >= 1920 * 1080) score += 2;
    else if (pixelCount >= 1280 * 720) score += 1;

    // Check for mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      score -= 2;
    }

    // Determine performance level
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  }

  private estimateGPUMemory(gl?: WebGLRenderingContext | WebGL2RenderingContext | null): number {
    if (!gl) return 512; // Default estimate

    // This is a simplified estimation
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxVertexTextureImageUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    const maxTextureImageUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    // Rough estimation based on available parameters
    return Math.min(maxTextureSize * maxTextureSize * 4 / 1024 / 1024 * maxTextureImageUnits, 4096);
  }

  private async detectVRCapabilities(): Promise<boolean> {
    if (!('xr' in navigator)) {
      return false;
    }

    try {
      const isSupported = await (navigator as any).xr?.isSessionSupported('immersive-vr');
      return !!isSupported;
    } catch {
      return false;
    }
  }

  getOptimalSettings(): {
    particleCount: number;
    shadowQuality: number;
    antiAliasing: boolean;
    textureQuality: number;
    maxFPS: number;
    enableShadows: boolean;
    enablePostProcessing: boolean;
  } {
    const capabilities = this.capabilities || {
      performanceLevel: 'medium',
      isMobile: false,
      maxTextureSize: 2048
    } as DeviceCapabilities;

    switch (capabilities.performanceLevel) {
      case 'high':
        return {
          particleCount: 1000,
          shadowQuality: 2048,
          antiAliasing: true,
          textureQuality: Math.min(capabilities.maxTextureSize, 2048),
          maxFPS: 60,
          enableShadows: true,
          enablePostProcessing: true
        };

      case 'medium':
        return {
          particleCount: 500,
          shadowQuality: 1024,
          antiAliasing: true,
          textureQuality: Math.min(capabilities.maxTextureSize, 1024),
          maxFPS: 45,
          enableShadows: true,
          enablePostProcessing: false
        };

      case 'low':
      default:
        return {
          particleCount: 200,
          shadowQuality: 512,
          antiAliasing: false,
          textureQuality: Math.min(capabilities.maxTextureSize, 512),
          maxFPS: 30,
          enableShadows: false,
          enablePostProcessing: false
        };
    }
  }

  async requestPermissions(): Promise<boolean> {
    const permissions = [];

    // Request camera permission if needed
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        await navigator.mediaDevices.getUserMedia({ video: true });
        permissions.push('camera');
      }
    } catch (error) {
      console.warn('Camera permission denied or unavailable');
    }

    // Request microphone permission for voice interaction
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        permissions.push('microphone');
      }
    } catch (error) {
      console.warn('Microphone permission denied or unavailable');
    }

    // Check for VR device access
    try {
      if ('xr' in navigator) {
        const session = await (navigator as any).xr?.requestSession('immersive-vr');
        await session.end();
        permissions.push('vr');
      }
    } catch (error) {
      console.warn('VR permission denied or unavailable');
    }

    return permissions.length > 0;
  }

  createFallbackMessage(): string {
    const capabilities = this.capabilities;
    if (!capabilities) return "Detecting device capabilities...";

    const issues = [];

    if (!capabilities.webgl2) {
      issues.push("WebGL2 is not supported");
    }

    if (!capabilities.webxr) {
      issues.push("WebXR/VR is not supported");
    }

    if (capabilities.performanceLevel === 'low') {
      issues.push("Device performance is limited");
    }

    if (issues.length === 0) {
      return "Your device supports all features!";
    }

    return `Limited features: ${issues.join(", ")}. Switching to optimized mode.`;
  }
}