/**
 * Cinematic Presentation Application Controller
 */

class PresentationController {
  constructor() {
    this.slideshow = new SlideshowManager(SLIDES);
    this.currentIndex = 0;
    this.targetIndex = 0;
    this.previewOverride = 'auto';
    this.idleTimer = null;

    this.cacheDom();
    this.motionEngine = new MotionEngine({
      layerA: this.layerA,
      layerB: this.layerB,
      imgA: this.imgA,
      imgB: this.imgB,
      silkWavOverlay: this.silkWavOverlay,
      goldenEdgeLine: this.goldenEdgeLine,
      goldenSweepOverlay: this.goldenSweepOverlay,
      sectionCurtain: this.sectionCurtain
    });

    this.init();
  }

  cacheDom() {
    this.layerA = document.getElementById('layerA');
    this.layerB = document.getElementById('layerB');
    this.imgA = document.getElementById('imgA');
    this.imgB = document.getElementById('imgB');
    this.hud = document.getElementById('controlsHud');
    this.topBar = document.getElementById('topInfoBar');
    this.counter = document.getElementById('hudCounter');
    this.topicBadge = document.getElementById('slideTopicBadge');
    this.progressBar = document.getElementById('progressBar');
    this.silkWavOverlay = document.getElementById('silkWavOverlay');
    this.goldenEdgeLine = document.getElementById('goldenEdgeLine');
    this.goldenSweepOverlay = document.getElementById('goldenSweepOverlay');
    this.sectionCurtain = document.getElementById('sectionCurtain');
    this.openingVeil = document.getElementById('openingVeil');
  }

  init() {
    this.bindEvents();
    this.slideshow.preloadSurroundings(0);
    this.updateHUD();
    this.triggerUserActivity();

    // Opening veil dismiss
    if (this.openingVeil) {
      setTimeout(() => {
        if (this.openingVeil && this.openingVeil.parentNode) {
          this.openingVeil.remove();
        }
      }, 1000);
    }
  }

  bindEvents() {
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      // Dismiss opening veil immediately on any key
      if (this.openingVeil && this.openingVeil.parentNode) {
        this.openingVeil.remove();
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goTo(this.slideshow.total - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    });

    // Touch & Swipe Controls
    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) this.next();
        else this.prev();
      }
    }, { passive: true });

    // HUD Buttons
    document.getElementById('hudBtnNext').addEventListener('click', () => this.next());
    document.getElementById('hudBtnPrev').addEventListener('click', () => this.prev());
    document.getElementById('arrowNext').addEventListener('click', () => this.next());
    document.getElementById('arrowPrev').addEventListener('click', () => this.prev());
    document.getElementById('btnFullscreen').addEventListener('click', () => this.toggleFullscreen());

    // FX Toggle
    const btnFx = document.getElementById('btnToggleFx');
    const fxText = document.getElementById('fxStateText');
    btnFx.addEventListener('click', () => {
      const current = this.motionEngine.effectsEnabled;
      this.motionEngine.setEffectsEnabled(!current);
      btnFx.classList.toggle('active', !current);
      fxText.textContent = !current ? 'BẬT' : 'TẮT';
    });

    // FX Preview Select
    const fxSelect = document.getElementById('fxSelectPreview');
    fxSelect.addEventListener('change', (e) => {
      this.previewOverride = e.target.value;
    });

    // Mouse movement reveals HUD
    window.addEventListener('mousemove', () => this.triggerUserActivity());
    window.addEventListener('click', () => this.triggerUserActivity());
  }

  triggerUserActivity() {
    this.hud.classList.add('visible');
    this.topBar.classList.add('visible');
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.hud.classList.remove('visible');
      this.topBar.classList.remove('visible');
    }, 3200);
  }

  next() {
    const base = this.motionEngine.isTransitioning ? this.targetIndex : this.currentIndex;
    if (base < this.slideshow.total - 1) {
      this.goTo(base + 1, 'next');
    }
  }

  prev() {
    const base = this.motionEngine.isTransitioning ? this.targetIndex : this.currentIndex;
    if (base > 0) {
      this.goTo(base - 1, 'prev');
    }
  }

  goTo(targetIndex, direction = 'next') {
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex >= this.slideshow.total) targetIndex = this.slideshow.total - 1;
    if (targetIndex === this.currentIndex && !this.motionEngine.isTransitioning) return;

    this.targetIndex = targetIndex;
    const targetSlide = this.slideshow.getSlide(targetIndex);
    if (!targetSlide) return;

    this.slideshow.preloadSurroundings(targetIndex);

    this.motionEngine.transitionTo({
      targetSlide,
      direction,
      previewOverride: this.previewOverride
    }, () => {
      this.currentIndex = targetIndex;
      this.targetIndex = targetIndex;
      this.updateHUD();
    });
  }

  updateHUD() {
    const slide = this.slideshow.getSlide(this.currentIndex);
    const numStr = String(this.currentIndex + 1).padStart(2, '0');
    const totalStr = String(this.slideshow.total).padStart(2, '0');

    this.counter.textContent = `${numStr} / ${totalStr}`;
    this.topicBadge.textContent = slide.title;
    this.progressBar.style.width = `${((this.currentIndex + 1) / this.slideshow.total) * 100}%`;

    // Visual arrow states
    document.getElementById('hudBtnPrev').style.opacity = this.currentIndex === 0 ? '0.35' : '1';
    document.getElementById('hudBtnNext').style.opacity = this.currentIndex === this.slideshow.total - 1 ? '0.35' : '1';
    document.getElementById('arrowPrev').style.visibility = this.currentIndex === 0 ? 'hidden' : 'visible';
    document.getElementById('arrowNext').style.visibility = this.currentIndex === this.slideshow.total - 1 ? 'hidden' : 'visible';
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.presentationApp = new PresentationController();
});
