document.addEventListener("DOMContentLoaded", function () {
  /* --- 0. HELPER ELEMENTS (Cursor, Progress Bar, Toast, Back-to-Top) --- */
  
  // Custom Cursor Ring
  const cursorRing = document.createElement("div");
  cursorRing.classList.add("cursor-ring");
  document.body.appendChild(cursorRing);

  window.addEventListener("mousemove", (e) => {
    cursorRing.style.top = `${e.clientY}px`;
    cursorRing.style.left = `${e.clientX}px`;
  });

  const hoverTargets = document.querySelectorAll("a, button, .card, .card-dot, .dot");
  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => cursorRing.classList.add("hovered"));
    target.addEventListener("mouseleave", () => cursorRing.classList.remove("hovered"));
  });

  // Scroll Progress Bar
  const progressBar = document.createElement("div");
  progressBar.classList.add("scroll-progress");
  document.body.appendChild(progressBar);

  // Toast Notification Element

  // Trigger welcome toast after 1.5 seconds
  

  // Back to Top Button Element
  const backToTopBtn = document.createElement("div");
  backToTopBtn.classList.add("back-to-top");
  backToTopBtn.innerHTML = "↑";
  document.body.appendChild(backToTopBtn);

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* --- 1. Reveal Elements Intersection Observer + Card Image Sliders trigger --- */
  const revealElements = document.querySelectorAll(".reveal");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        // Trigger slider initialization if it's a card container
        if (entry.target.classList.contains("card") && !entry.target.dataset.sliderInitialized) {
          initCardSlider(entry.target);
          entry.target.dataset.sliderInitialized = "true";
        }
      }
    });
  };

  const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
  revealElements.forEach(element => scrollObserver.observe(element));

  const cardSliders = document.querySelectorAll(".card, [data-card-slider]");
  cardSliders.forEach(card => {
    scrollObserver.observe(card);
  });

  function initCardSlider(cardElement) {
    const slides = cardElement.querySelectorAll(".slide-img");
    const dots = cardElement.querySelectorAll(".card-dot");
    if (slides.length === 0) return;

    let currentIndex = 0;
    let direction = 1;

    function updateSlider() {
      slides.forEach(s => s.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));

      slides[currentIndex].classList.add("active");
      if (dots[currentIndex]) dots[currentIndex].classList.add("active");

      if (currentIndex === slides.length - 1) {
        direction = -1;
      } else if (currentIndex === 0) {
        direction = 1;
      }

      currentIndex += direction;
    }

    const cardInterval = setInterval(updateSlider, 5000);

    // Allow manual dot clicking inside cards
    dots.forEach((dot, dIndex) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        currentIndex = dIndex;
        slides[currentIndex].classList.add("active");
        dots[currentIndex].classList.add("active");
      });
    });
  }

  /* --- 2. Automated Hero Banner Slider Logic --- */
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDots = document.querySelectorAll(".slider-dots .dot");
  let currentHeroSlide = 0;

  function goToHeroSlide(index) {
    heroSlides.forEach(slide => slide.classList.remove("active"));
    heroDots.forEach(dot => dot.classList.remove("active"));

    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
    
    heroSlides[currentHeroSlide].classList.add("active");
    if (heroDots[currentHeroSlide]) heroDots[currentHeroSlide].classList.add("active");
  }

  function nextHeroSlide() {
    goToHeroSlide(currentHeroSlide + 1);
  }

  let heroInterval = setInterval(nextHeroSlide, 5000);

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToHeroSlide(index);
      clearInterval(heroInterval);
      heroInterval = setInterval(nextHeroSlide, 5000);
    });
  });

  /* --- 3. Mobile Navigation Toggle Logic --- */
  const menuToggle = document.getElementById("menuToggle") || document.querySelector(".menu-toggle");
  const navLinks = document.getElementById("navLinks") || document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    });
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      if (menuToggle) menuToggle.classList.remove("active");
      if (navLinks) navLinks.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  /* --- 4. Parallax Elements Setup --- */
  const badge1 = document.querySelector(".card-1");
  const badge2 = document.querySelector(".card-2");

  /* --- 5. Consolidated Window Scroll Handler --- */
  const nav = document.querySelector('.glass-nav');
  let lastScrollTop = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll < 0) return;

    // A. Scroll Progress Bar Update
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (currentScroll / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;

    // B. Navbar Hide/Show & Shadow Logic
    if (nav) {
      if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }

      if (currentScroll > 30) {
        nav.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.06)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }

    // C. Parallax Scrolling Effect for Badges
    if (badge1) badge1.style.transform = `translateY(${currentScroll * 0.4}px)`;
    if (badge2) badge2.style.transform = `translateY(${currentScroll * 0.15}px)`;

    // D. Back to Top Button Toggle
    if (currentScroll > 500) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }

    lastScrollTop = currentScroll;
  });
});