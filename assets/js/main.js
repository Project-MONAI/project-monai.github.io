(function() {

    "use strict";

    //WOW Scroll Spy
    var wow = new WOW({
        //disabled for mobile
        mobile: false
    });
    wow.init();
    window.onscroll = function() {
        // show or hide the back-top-top button
        var backToTop = document.querySelector(".back-to-top");
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTop.style.display = "flex";
        } else {
            backToTop.style.display = "none";
        }
    }

    //===== close navbar-collapse when a  clicked
    let navbarToggler = document.querySelector(".navbar-toggler");
    var navbarCollapse = document.querySelector(".navbar-collapse");
    navbarToggler.addEventListener('click', function() {
        navbarToggler.classList.toggle("active");
        navbarCollapse.classList.toggle('show')
    })

    // let docsDropdown = document.querySelector(".docsDropdown");
    // let docsDropWrapper = document.querySelector(".docsDropWrapper");
    // docsDropdown.addEventListener('mouseover', function() {
    //     console.log("Hello");
    //     docsDropWrapper.classList.toggle('show');
    // })

    // Main.js
    /* ---- particles.js config ---- */

    particlesJS("hero-area", {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#5dc1b7"
            },
            "opacity": {
                "value": 0.2,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 4,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 200,
                "color": "#5d5d5d",
                "opacity": .1,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "retina_detect": true
    });


})();