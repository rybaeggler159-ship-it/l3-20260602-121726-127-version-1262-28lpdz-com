(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".mobile-menu-button");
        var mobileNav = document.querySelector(".mobile-nav");
        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        }

        var searchForms = Array.prototype.slice.call(document.querySelectorAll(".search-panel"));
        searchForms.forEach(function (form) {
            var input = form.querySelector("input");
            var button = form.querySelector("button");
            var scope = document.querySelector(form.getAttribute("data-scope") || "body") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

            function applySearch() {
                var query = (input.value || "").trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = card.getAttribute("data-search") || "";
                    card.classList.toggle("hidden-card", query && text.indexOf(query) === -1);
                });
            }

            if (input) {
                input.addEventListener("input", applySearch);
            }
            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    applySearch();
                });
            }
        });
    });

    window.setupPlayer = function (source) {
        ready(function () {
            var video = document.querySelector(".player-stage video");
            var cover = document.querySelector(".player-cover");
            var button = document.querySelector(".play-button");
            var started = false;

            if (!video || !source) {
                return;
            }

            function bindSource() {
                if (started) {
                    return;
                }
                started = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                } else {
                    video.src = source;
                }
            }

            function play() {
                bindSource();
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                var result = video.play();
                if (result && result.catch) {
                    result.catch(function () {});
                }
            }

            if (cover) {
                cover.addEventListener("click", play);
            }
            if (button) {
                button.addEventListener("click", function (event) {
                    event.stopPropagation();
                    play();
                });
            }
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
        });
    };
})();
