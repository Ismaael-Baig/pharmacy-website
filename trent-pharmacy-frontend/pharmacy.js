document.addEventListener("DOMContentLoaded", () => {
  // === 1) Dynamic Header Loading ===
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        headerContainer.innerHTML = data;
        // === Modal Functionality (After Header Load) ===
        const modal = document.getElementById("modal");
        const openModal = document.getElementById("openModal");
        const closeModal = document.querySelector(".close");
        if (modal && openModal && closeModal) {
          modal.style.display = "none";
          openModal.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
          });
          closeModal.addEventListener("click", () => {
            modal.style.display = "none";
          });
          window.addEventListener("click", (event) => {
            if (event.target === modal) {
              modal.style.display = "none";
            }
          });
        }
        // === Dropdown Menu Functionality ===
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
          dropdown.addEventListener('mouseenter', () => {
            const content = dropdown.querySelector('.dropdown-content');
            if (content) content.style.display = 'block';
          });
          dropdown.addEventListener('mouseleave', () => {
            const content = dropdown.querySelector('.dropdown-content');
            if (content) content.style.display = 'none';
          });
        });
        // === Active Link Highlighting ===
        const currentPath = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll("nav a");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
          }
        });
      })
      .catch(error => console.error('Error loading header:', error));
  }

  // === 2) Custom Hero Slider Initialization ===
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    let currentSlide = 0;
    slides[currentSlide].classList.add('active');
    animateHeroContent(slides[currentSlide]);
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
      animateHeroContent(slides[currentSlide]);
    }, 7000); // 7 seconds per slide
  }

  // Updated function: animate each child element in the hero text one at a time (left-to-right) with slower transitions
  function animateHeroContent(slide) {
    const content = slide.querySelector('.hero-text-later');
    if (content) {
      const items = Array.from(content.children);
      // Reset each item: hide and shift left
      items.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateX(-50px)";
        item.style.transition = "";
      });
      // Animate each item sequentially with a longer delay and slower transition
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.transition = "opacity 1s ease, transform 1s ease";
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
        }, index * 500); // 500ms delay between each element
      });
    }
  }

  initHeroSlider();

  // === 3) Custom Aesthetics Slider Initialization ===
  function initAestheticsSlider() {
    const slides = document.querySelectorAll('.aesthetics-slide');
    if (!slides.length) return;
    let currentSlide = 0;
    slides[currentSlide].classList.add('active');
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 3000); // 3 seconds per slide
  }
  initAestheticsSlider();

  // === 4) Single-open FAQ Toggling with Slide-down Transitions ===
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });
        item.classList.toggle('active');
      });
    }
  });
});
