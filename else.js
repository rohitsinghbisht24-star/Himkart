document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('[data-card-slider]');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide-img');
        const dots = slider.querySelectorAll('.card-dot, .card-slider-dots span');
        const counterCurrent = slider.querySelector('.current-slide');
        const totalSlidesEl = slider.querySelector('.total-slides');
        
        if (totalSlidesEl) {
            totalSlidesEl.textContent = slides.length;
        }

        if (slides.length <= 1) return;

        let currentIndex = 0;
        let direction = 1; 
        let autoSlideInterval = null;
        const intervalTime = parseInt(slider.getAttribute('data-auto-slide')) || 3000;
        const isPingPong = slider.getAttribute('data-ping-pong') === 'true';

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

            currentIndex = index;

            slides[currentIndex].classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');

            if (counterCurrent) {
                counterCurrent.textContent = currentIndex + 1;
            }
        }

        function nextSlide() {
            if (isPingPong) {
                if (currentIndex + direction >= slides.length) {
                    direction = -1;
                } else if (currentIndex + direction < 0) {
                    direction = 1;
                }
                goToSlide(currentIndex + direction);
            } else {
                let nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }
        }

        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, intervalTime);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        startAutoSlide();

        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        let startX = 0;
        let isDragging = false;

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            stopAutoSlide();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                startAutoSlide();
            }
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentX = e.clientX;
            const diff = startX - currentX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    let nextIndex = isPingPong ? 
                        (currentIndex + 1 < slides.length ? currentIndex + 1 : currentIndex) : 
                        (currentIndex + 1) % slides.length;
                    if(isPingPong && currentIndex === slides.length - 1) direction = -1;
                    goToSlide(nextIndex);
                } else {
                    let prevIndex = isPingPong ? 
                        (currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex) : 
                        (currentIndex - 1 + slides.length) % slides.length;
                    if(isPingPong && currentIndex === 0) direction = 1;
                    goToSlide(prevIndex);
                }
                isDragging = false;
            }
        });

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoSlide();
        });

        slider.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    let nextIndex = isPingPong ? 
                        (currentIndex + 1 < slides.length ? currentIndex + 1 : currentIndex) : 
                        (currentIndex + 1) % slides.length;
                    goToSlide(nextIndex);
                } else {
                    let prevIndex = isPingPong ? 
                        (currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex) : 
                        (currentIndex - 1 + slides.length) % slides.length;
                    goToSlide(prevIndex);
                }
            }
            startAutoSlide();
        });
    });
});