/**
 * Cinematic Motion Engine
 * Coordinates GPU-accelerated CSS Transitions, Easing, and Double-Buffering
 */

class MotionEngine {
  constructor(domElements) {
    this.layerA = domElements.layerA;
    this.layerB = domElements.layerB;
    this.imgA = domElements.imgA;
    this.imgB = domElements.imgB;
    this.silkWavOverlay = domElements.silkWavOverlay;
    this.goldenEdgeLine = domElements.goldenEdgeLine;
    this.goldenSweepOverlay = domElements.goldenSweepOverlay;
    this.sectionCurtain = domElements.sectionCurtain;

    this.activeLayerId = 'A';
    this.isTransitioning = false;
    this.effectsEnabled = true;
    this.pendingRequest = null;
  }

  setEffectsEnabled(val) {
    this.effectsEnabled = Boolean(val);
  }

  transitionTo({ targetSlide, direction = 'next', previewOverride = 'auto' }, onDone) {
    if (this.isTransitioning) {
      // Queue maximum 1 next action if user presses quickly
      this.pendingRequest = { targetSlide, direction, previewOverride, onDone };
      return;
    }

    this.isTransitioning = true;

    const currentLayer = this.activeLayerId === 'A' ? this.layerA : this.layerB;
    const nextLayer = this.activeLayerId === 'A' ? this.layerB : this.layerA;
    const nextImg = this.activeLayerId === 'A' ? this.imgB : this.imgA;

    // Determine FX
    let fx = targetSlide.transition;
    if (previewOverride !== 'auto') {
      fx = previewOverride;
    }
    if (!this.effectsEnabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fx = 'fade-simple';
    }

    // Assign image source with fallback
    nextImg.src = targetSlide.src;
    nextImg.onerror = () => { nextImg.src = targetSlide.fallback; };

    const isRev = direction === 'prev';
    const duration = (fx === 'section' || fx === 'opening') ? 720 : 620;

    // Reset base classes
    currentLayer.className = 'slide-layer active outgoing';
    nextLayer.className = 'slide-layer incoming';
    nextLayer.style.clipPath = '';
    currentLayer.style.clipPath = '';

    const finalize = () => {
      this.activeLayerId = this.activeLayerId === 'A' ? 'B' : 'A';
      this.isTransitioning = false;
      if (typeof onDone === 'function') onDone();

      // Process pending queue if user queued an action
      if (this.pendingRequest) {
        const req = this.pendingRequest;
        this.pendingRequest = null;
        this.transitionTo(req, req.onDone);
      }
    };

    if (fx === 'silk-wave') {
      // A. Silk Wave Transition
      if (this.silkWavOverlay) {
        this.silkWavOverlay.className = isRev ? 'silk-wave-container animating-rev' : 'silk-wave-container animating';
      }
      setTimeout(() => {
        nextLayer.className = 'slide-layer active';
      }, 260);

      setTimeout(() => {
        if (this.silkWavOverlay) this.silkWavOverlay.className = 'silk-wave-container';
        currentLayer.className = 'slide-layer';
        finalize();
      }, 640);

    } else if (fx === 'directional') {
      // C. Directional Reveal with Golden Edge Sweep
      nextLayer.className = `slide-layer active ${isRev ? 'directional-reveal-in-rev' : 'directional-reveal-in'}`;
      if (this.goldenEdgeLine) {
        this.goldenEdgeLine.className = `golden-edge-line ${isRev ? 'active-rev' : 'active'}`;
      }

      setTimeout(() => {
        if (this.goldenEdgeLine) this.goldenEdgeLine.className = 'golden-edge-line';
        currentLayer.className = 'slide-layer';
        nextLayer.className = 'slide-layer active';
        nextLayer.style.clipPath = '';
        finalize();
      }, 620);

    } else if (fx === 'depth') {
      // D. Layered Depth Transition
      currentLayer.className = 'slide-layer outgoing layered-depth-out';
      nextLayer.className = 'slide-layer active layered-depth-in';

      setTimeout(() => {
        currentLayer.className = 'slide-layer';
        nextLayer.className = 'slide-layer active';
        finalize();
      }, 650);

    } else if (fx === 'golden-sweep') {
      // E. Golden Light Sweep
      if (this.goldenSweepOverlay) {
        this.goldenSweepOverlay.className = 'golden-sweep-overlay active';
      }
      setTimeout(() => {
        currentLayer.className = 'slide-layer outgoing anim-fade-zoom-out';
        nextLayer.className = 'slide-layer active anim-fade-zoom-in';
      }, 150);

      setTimeout(() => {
        if (this.goldenSweepOverlay) this.goldenSweepOverlay.className = 'golden-sweep-overlay';
        currentLayer.className = 'slide-layer';
        nextLayer.className = 'slide-layer active';
        finalize();
      }, 640);

    } else if (fx === 'section') {
      // F. Section Reveal Velvet Curtain
      if (this.sectionCurtain) {
        this.sectionCurtain.className = 'section-curtain active';
      }
      setTimeout(() => {
        nextLayer.className = 'slide-layer active anim-fade-zoom-in';
      }, 240);

      setTimeout(() => {
        if (this.sectionCurtain) this.sectionCurtain.className = 'section-curtain';
        currentLayer.className = 'slide-layer';
        nextLayer.className = 'slide-layer active';
        finalize();
      }, 720);

    } else {
      // B. Cinematic Fade & Zoom (Standard & Fallback)
      currentLayer.className = 'slide-layer outgoing anim-fade-zoom-out';
      nextLayer.className = 'slide-layer active anim-fade-zoom-in';

      setTimeout(() => {
        currentLayer.className = 'slide-layer';
        nextLayer.className = 'slide-layer active';
        finalize();
      }, duration);
    }
  }
}
