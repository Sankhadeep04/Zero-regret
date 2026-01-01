// ============================================
// DOM ELEMENTS
// ============================================

const menuBtn = document.getElementById('menuBtn');
const cartBtn = document.getElementById('cartBtn');
const searchBtn = document.getElementById('searchBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const logoBtn = document.getElementById('logoBtn');

const menuSidebar = document.getElementById('menuSidebar');
const cartSidebar = document.getElementById('cartSidebar');
const searchContainer = document.getElementById('searchContainer');
const overlay = document.getElementById('overlay');
const navbar = document.getElementById('navbar');


// ============================================
// DYNAMIC MENU & EVENT INITIALIZATION
// ============================================

// ============================================
// DYNAMIC MENU LOADER & EVENT BINDING
// ============================================

async function loadDynamicMenu() {
    const grid = document.querySelector('.menu-cards-grid');
    if (!grid) return;
    
    try {
        const response = await fetch('menu.json');
        const menuData = await response.json();
        
        // 1. Inject cards into the grid
        grid.innerHTML = menuData.map(item => `
            <div class="menu-card" data-category="${Array.isArray(item.category) ? item.category.join(' ') : item.category}">
                <div class="card-image-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="card-food-img">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-rating">
                            <span class="star">⭐</span>
                            <span class="rating-value">${item.rating}</span>
                        </div>
                        <h3 class="card-title">${item.name}</h3>
                    </div>
                    <p class="card-description">${item.description}</p>
                    <div class="card-footer">
                        <div class="price-container">
                            ${item.originalPrice ? `<span class="original-price">${item.originalPrice}</span>` : ''}
                            <span class="card-price">${item.price}</span>
                        </div>
                        <button class="nutrition-btn" 
                            data-calories="${item.nutrition.calories}" 
                            data-carbs="${item.nutrition.carbs}" 
                            data-protein="${item.nutrition.protein}" 
                            data-fats="${item.nutrition.fats}">
                            Know your nutritions
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // 2. RE-BIND EVENTS (Must happen AFTER grid.innerHTML is set)
        initNutritionPopup();
        initImageLightbox();
        setupFilters(); 

    } catch (error) {
        console.error("Error loading menu:", error);
    }
}

// ============================================
// NUTRITION POPUP LOGIC (FIXED)
// ============================================
function initNutritionPopup() {
    const nutritionOverlay = document.getElementById('nutritionOverlay');
    const closeBtn = document.getElementById('closeNutrition');
    // Important: Select buttons ONLY after they have been injected into the DOM
    const nutritionBtns = document.querySelectorAll('.nutrition-btn');

    nutritionBtns.forEach(btn => {
        btn.onclick = () => {
            // Populate the popup values from data attributes
            document.getElementById('caloriesValue').innerText = btn.getAttribute('data-calories') + "kcal";
            document.getElementById('carbsValue').innerText = btn.getAttribute('data-carbs') + "gm";
            document.getElementById('proteinValue').innerText = btn.getAttribute('data-protein') + "g";
            document.getElementById('fatsValue').innerText = btn.getAttribute('data-fats') + "g";
            
            nutritionOverlay.classList.add('active');
        };
    });

    // Close logic
    if (closeBtn) {
        closeBtn.onclick = () => nutritionOverlay.classList.remove('active');
    }

    // Close on background click
    window.onclick = (event) => {
        if (event.target == nutritionOverlay) {
            nutritionOverlay.classList.remove('active');
        }
    };
}

// ============================================
// IMAGE LIGHTBOX LOGIC (FIXED)
// ============================================
function initImageLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const foodImages = document.querySelectorAll('.card-food-img');

    foodImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // FIX: Close when clicking the overlay background
    lightbox.onclick = (e) => {
        // This ensures clicking the image itself doesn't close it, only the background
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
}

// Initial call
document.addEventListener('DOMContentLoaded', loadDynamicMenu);

// Function to handle filtering after cards are loaded
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked one
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                // Get the string and split it into an array of clean words
                const categoryAttr = card.getAttribute('data-category') || "";
                const cardCategories = categoryAttr.split(' ').map(cat => cat.trim().toLowerCase());

                if (filterValue === 'all' || cardCategories.includes(filterValue.toLowerCase())) {
                    card.style.display = 'block';
                    // Optional: Add a small fade-in effect
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

// Call the main loader on page load
// ============================================
// NAVBAR + SIDEBAR CONTROLS
// ============================================



// Menu Sidebar
menuBtn?.addEventListener('click', () => {
    if (menuSidebar && overlay) {
        menuSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    
    // Safely close others
    if (cartSidebar) cartSidebar.classList.confirm('active') && cartSidebar.classList.remove('active');
    if (searchContainer) searchContainer.classList.remove('active');
});
// Open Cart
// cartBtn.addEventListener('click', () => {
//     cartSidebar.classList.add('active');
//     overlay.classList.add('active');
// });



// Toggle Search
searchBtn?.addEventListener('click', () => {
    console.log("Search button clicked");
    
    // 1. Safely toggle the search and overlay
    if (searchContainer) searchContainer.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');

    // 2. Safely close other elements ONLY if they exist
    if (menuSidebar) menuSidebar.classList.remove('active');
    if (cartSidebar) cartSidebar.classList.remove('active');
});
// Close Search
searchCloseBtn?.addEventListener('click', () => {
    if (searchContainer) searchContainer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
});
// Close Everything via Overlay
overlay?.addEventListener('click', () => {
    console.log("Overlay clicked - closing all");

    // We check if each exists before trying to touch them
    if (menuSidebar) menuSidebar.classList.remove('active');
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (searchContainer) searchContainer.classList.remove('active');
    
    // This MUST run last to remove the blur/darkness
    if (overlay) overlay.classList.remove('active');
});
// Logo scroll to top
logoBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Close menu on menu item click
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        menuSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // Scrolling Down - Hide Navbar
        navbar.style.top = "-80px"; 
    } else {
        // Scrolling Up - Show Navbar
        navbar.style.top = "0";
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
});

// 4. RESET TO TOP ON REFRESH
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
// ============================================
// ADD TO CART FUNCTIONALITY
// ============================================

const addButtons = document.querySelectorAll('.add-to-cart-btn');

addButtons.forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.menu-card');
        if (!card) return;

        const name = card.querySelector('.card-title')?.textContent;
        const price = card.querySelector('.card-price')?.textContent;

        const originalText = this.innerHTML;
        this.innerHTML = '✔ Added';
        this.style.background = '#00FF08';
        this.style.color = '#000';

        showNotification(`${name} added to cart (${price})`);

        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = '';
            this.style.color = '';
        }, 2000);
    });
});

// ============================================
// PLAN BUTTONS
// ============================================

document.querySelectorAll('.plan-btn').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.plan-card');
        const planName = card.querySelector('h3').textContent;
        const planPrice = card.querySelector('.plan-price').textContent;

        showNotification(`${planName} selected (${planPrice})`);

        document.querySelectorAll('.plan-card').forEach(c => {
            c.style.borderColor = '#007504';
        });

        card.style.borderColor = '#00FF08';
    });
});

// ============================================
// CONTACT FORM
// ============================================

const submitBtn = document.querySelector('.submit-btn');
const formInputs = document.querySelectorAll('.form-input');
const formTextarea = document.querySelector('.form-textarea');

submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    const name = formInputs[0].value.trim();
    const email = formInputs[1].value.trim();
    const message = formTextarea.value.trim();

    if (!name || !email || !message) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Invalid email address!', 'error');
        return;
    }

    showNotification('Message sent successfully!');

    formInputs[0].value = '';
    formInputs[1].value = '';
    formTextarea.value = '';
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'success') {
    const old = document.querySelector('.notification');
    if (old) old.remove();

    const note = document.createElement('div');
    note.className = 'notification';
    note.textContent = message;

    note.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'error' ? '#ff4d4d' : '#00FF08'};
        color: #000;
        padding: 1rem 2rem;
        border-radius: 40px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.4s ease, slideOut 0.4s ease 2.6s;
    `;

    document.body.appendChild(note);

    setTimeout(() => note.remove(), 3000);
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from { transform: translateX(300px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(300px); opacity: 0; }
}
`;
document.head.appendChild(style);

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'error' ? '#ff5722' : '#00FF08'};
        color: #000000;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0, 255, 8, 0.4);
        animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 2.6s;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// UNUSED / OLD CODE (COMMENTED AS REQUESTED)
// ============================================

/*
menuToggle
sidebar
sidebarOverlay
closeBtn
sidebarLinks
navLogo

Old sidebar logic from previous layout – not used anymore.
Kept here for reference only.
*/
