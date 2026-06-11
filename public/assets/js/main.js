(function () {
  "use strict";

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

})();
