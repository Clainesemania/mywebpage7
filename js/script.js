// --- Configuration ---
const slider = document.getElementById('mainSlider');
const sections = document.querySelectorAll('.slider-section');
const dots = document.querySelectorAll('.slider-pagination .dot');
const numSections = sections.length;
let currentSectionIndex = 0;
let isScrolling = false; // Flag to prevent multiple scrolls at once

// --- Functions ---

// Function to update the active section and pagination
const updateActiveSection = (newIndex) => {
    // 1. Remove active class from current section and its dot
    sections[currentSectionIndex].classList.remove('active');
    dots[currentSectionIndex].classList.remove('active');

    // 2. Add active class to the new section and its dot
    sections[newIndex].classList.add('active');
    dots[newIndex].classList.add('active');

    // 3. Move the entire main-slider container
    slider.style.transform = `translateY(${newIndex * -100}vh)`;

    // 4. Update the index
    currentSectionIndex = newIndex;
};

// Function to handle the scrolling event (mouse wheel)
const handleWheel = (event) => {
    event.preventDefault(); // Prevent default browser scrolling
    if (isScrolling) return; // Ignore if already mid-scroll

    let nextIndex;
    if (event.deltaY > 0) {
        // Scrolling down
        nextIndex = currentSectionIndex + 1;
    } else {
        // Scrolling up
        nextIndex = currentSectionIndex - 1;
    }

    // Edge-case checks: prevent going out of bounds
    if (nextIndex >= 0 && nextIndex < numSections) {
        isScrolling = true; // Set flag
        updateActiveSection(nextIndex);

        // Reset flag after transition speed is over
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // Wait for the transition to complete (CSS speed + small buffer)
    }
};

// Function to handle dot clicks
const handleDotClick = (event) => {
    const dotIndex = parseInt(event.target.getAttribute('data-index'));
    updateActiveSection(dotIndex);
};

// --- Touch Events (For Mobile) ---
let touchStartY = 0;
let touchEndY = 0;

const handleTouchStart = (event) => {
    touchStartY = event.changedTouches[0].screenY;
};

const handleTouchEnd = (event) => {
    touchEndY = event.changedTouches[0].screenY;
    handleTouchSwipe();
};

const handleTouchSwipe = () => {
    if (isScrolling) return;

    let nextIndex;
    // Check swipe direction
    if (touchEndY < touchStartY) {
        // Swipe up -> Scroll down
        nextIndex = currentSectionIndex + 1;
    } else if (touchEndY > touchStartY) {
        // Swipe down -> Scroll up
        nextIndex = currentSectionIndex - 1;
    }

    // Edge cases and update
    if (nextIndex >= 0 && nextIndex < numSections) {
        isScrolling = true;
        updateActiveSection(nextIndex);
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
};

// --- Initial Setup & Event Listeners ---

// 1. Position all sections in a column
sections.forEach((section, index) => {
    section.style.top = `${index * 100}vh`;
});

// 2. Attach event listeners
window.addEventListener('wheel', handleWheel, { passive: false }); // Wheel for desktop

// 3. Dot click listener
dots.forEach(dot => {
    dot.addEventListener('click', handleDotClick);
});

// 4. Touch events for mobile
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchend', handleTouchEnd);
