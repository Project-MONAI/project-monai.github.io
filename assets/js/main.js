(function () {
  "use strict";

  // Performance optimization: Defer non-critical operations
  function deferNonCriticalOperations() {
    // Initialize particles.js after initial paint
    const heroArea = document.getElementById("hero-area");
    if (heroArea) {
      requestIdleCallback(() => {
        initParticles();
      });
    }
  }

  // Initialize particles.js with optimized config
  function initParticles() {
    particlesJS("hero-area", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#5dc1b7",
        },
        opacity: {
          value: 0.2,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 4,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 200,
          color: "#5d5d5d",
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      retina_detect: true,
    });
  }

  // Throttled scroll handler for better performance
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Optimized scroll handler
  window.onscroll = throttle(function () {
    const backToTop = document.querySelector(".back-to-top");
    if (!backToTop) return;

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    backToTop.style.display = scrollPosition > 200 ? "flex" : "none";
  }, 100);

  // Mobile menu handler with performance optimization
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", () => {
      requestAnimationFrame(() => {
        navbarToggler.classList.toggle("active");
        navbarCollapse.classList.toggle("show");
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferNonCriticalOperations);
  } else {
    deferNonCriticalOperations();
  }
})();
