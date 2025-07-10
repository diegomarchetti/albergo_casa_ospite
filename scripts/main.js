// Main JavaScript functionality for Hotel Casa dell'Ospite website

class HotelWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupHeroGallery();
        this.setupLightbox();
        this.setupFAQ();
        this.setupContactForm();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                this.toggleNavIcon(navToggle);
            });
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (navToggle) {
                    this.resetNavIcon(navToggle);
                }
            });
        });

        // Update active nav link on scroll
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());

        // Header background on scroll
        this.setupHeaderScroll();
    }

    toggleNavIcon(toggle) {
        const spans = toggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        });
    }

    resetNavIcon(toggle) {
        const spans = toggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    setupHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // Hero gallery functionality
    setupHeroGallery() {
        const images = document.querySelectorAll('.gallery-image');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % images.length;
            showSlide(currentSlide);
        };

        const startSlideshow = () => {
            slideInterval = setInterval(nextSlide, 4000);
        };

        const stopSlideshow = () => {
            clearInterval(slideInterval);
        };

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopSlideshow();
                setTimeout(startSlideshow, 5000); // Restart after 5 seconds
            });
        });

        // Pause on hover
        const galleryContainer = document.querySelector('.gallery-container');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', stopSlideshow);
            galleryContainer.addEventListener('mouseleave', startSlideshow);
        }

        // Start slideshow
        startSlideshow();
    }

    // Lightbox functionality
    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const galleryItems = document.querySelectorAll('.gallery-item');

        let currentImageIndex = 0;
        let currentGallery = [];

        const openLightbox = (imageSrc, gallery, index) => {
            lightboxImage.src = imageSrc;
            currentGallery = gallery;
            currentImageIndex = index;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
            lightboxImage.src = currentGallery[currentImageIndex].src;
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
            lightboxImage.src = currentGallery[currentImageIndex].src;
        };

        // Group gallery items by data-lightbox attribute
        const galleries = {};
        galleryItems.forEach((item, index) => {
            const galleryName = item.getAttribute('data-lightbox') || 'default';
            if (!galleries[galleryName]) {
                galleries[galleryName] = [];
            }
            galleries[galleryName].push(item);

            item.addEventListener('click', () => {
                const gallery = galleries[galleryName];
                const itemIndex = gallery.indexOf(item);
                openLightbox(item.src, gallery, itemIndex);
            });
        });

        // Event listeners
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }

        // Close on background click
        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                switch (e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        showPrevImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });
    }

    // FAQ functionality
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Contact form functionality
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Per favore, compila tutti i campi obbligatori.', 'error');
            return;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Per favore, inserisci un indirizzo email valido.', 'error');
            return;
        }

        // Simulate form submission
        this.showNotification('Messaggio inviato con successo! Ti contatteremo presto.', 'success');
        form.reset();

        // In a real application, you would send the data to a server
        console.log('Form data:', data);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.servizio-card, .feature-card, .recensione-card, .info-card');
        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format date for form inputs
    formatDate(date) {
        return date.toISOString().split('T')[0];
    },

    // Get today's date for form validation
    getTodayDate() {
        return this.formatDate(new Date());
    }
};

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HotelWebsite();
    
    // Set minimum date for check-in to today
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) {
        checkinInput.min = utils.getTodayDate();
        
        checkinInput.addEventListener('change', () => {
            if (checkoutInput) {
                const checkinDate = new Date(checkinInput.value);
                checkinDate.setDate(checkinDate.getDate() + 1);
                checkoutInput.min = utils.formatDate(checkinDate);
            }
        });
    }
});

// Handle window resize events
window.addEventListener('resize', utils.debounce(() => {
    // Recalculate any layout-dependent functionality
    const navMenu = document.querySelector('.nav-menu');
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
    }
}, 250));

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or intervals when page is not visible
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page becomes visible
        console.log('Page visible - resuming animations');
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HotelWebsite, utils };
}



// Manage sending email
document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const messaggio = document.getElementById("messaggio").value;

    // Costruzione corpo email
    let corpoEmail = `Nome: ${nome}%0A`;
    corpoEmail += `Email: ${email}%0A`;
    if (telefono) corpoEmail += `Telefono: ${telefono}%0A`;
    if (checkin) corpoEmail += `Check-in: ${checkin}%0A`;
    if (checkout) corpoEmail += `Check-out: ${checkout}%0A`;
    corpoEmail += `%0AMessaggio:%0A${messaggio}`;

    const mailto = `mailto:casa.ospite.bs@fondazionecamplani.it?subject=Nuovo contatto dal web&body=${corpoEmail}`;

    // Mostra popup
    const popup = document.getElementById("popup");
    popup.style.display = "flex";

    // Gestione click OK
    document.getElementById("popup-ok").onclick = function() {
        popup.style.display = "none";
        
        // Metodo affidabile per aprire email
        try {
            window.location.href = mailto;
        } catch (error) {
            // Fallback: creazione dinamica link
            const link = document.createElement('a');
            link.href = mailto;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        // Reset form
        document.getElementById("contact-form").reset();
    };
});


// Mostra il modal automaticamente al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
     // Controlla se l'utente ha già visto il modal oggi
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('worksModalLastShown');
            
    // Mostra il modal se non è stato visto oggi
    if (lastShown !== today) {
        setTimeout(() => {
            showWorksModal();
        }, 1000); // Attende 1 secondo dopo il caricamento
    }
});

function showWorksModal() {
    const modal = document.getElementById('works-modal');
    modal.classList.add('show');
            
    // Impedisce lo scroll della pagina
    document.body.style.overflow = 'hidden';
 }

function hideWorksModal() {
    const modal = document.getElementById('works-modal');
    modal.classList.remove('show');
            
    // Ripristina lo scroll della pagina
    document.body.style.overflow = '';
            
    // Salva che l'utente ha visto il modal oggi
    const today = new Date().toDateString();
    localStorage.setItem('worksModalLastShown', today);
}

function contactUs() {
    // Nasconde il modal
    hideWorksModal();
            
    // Scroll alla sezione contatti (se esiste)
    const contactSection = document.getElementById('contatti');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Fallback: apri il telefono
        window.location.href = 'tel:0303709442';
    }
}

// Chiudi modal premendo ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideWorksModal();
    }
});

// Chiudi modal cliccando fuori
document.getElementById('works-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideWorksModal();
    }
});
