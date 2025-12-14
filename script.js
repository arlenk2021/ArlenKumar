// Arlen Kumar - Personal Website JavaScript
// Modern interactions and animations

document.addEventListener('DOMContentLoaded', function() {
	// ========================================
	// Navigation
	// ========================================
	const nav = document.querySelector('.nav');
	const navToggle = document.querySelector('.nav__toggle');
	const mobileMenu = document.querySelector('.mobile-menu');
	const mobileLinks = document.querySelectorAll('.mobile-menu__link');

	// Scroll effect for navigation
	let lastScroll = 0;
	
	window.addEventListener('scroll', () => {
		const currentScroll = window.pageYOffset;
		
		// Add scrolled class for styling
		if (currentScroll > 50) {
			nav.classList.add('scrolled');
		} else {
			nav.classList.remove('scrolled');
		}
		
		lastScroll = currentScroll;
	});

	// Mobile menu toggle
	if (navToggle && mobileMenu) {
		navToggle.addEventListener('click', () => {
			navToggle.classList.toggle('active');
			mobileMenu.classList.toggle('active');
			document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
		});

		// Close mobile menu when clicking a link
		mobileLinks.forEach(link => {
			link.addEventListener('click', () => {
				navToggle.classList.remove('active');
				mobileMenu.classList.remove('active');
				document.body.style.overflow = '';
			});
		});
	}

	// ========================================
	// Smooth Scroll for anchor links
	// ========================================
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			const href = this.getAttribute('href');
			if (href === '#') return;
			
			e.preventDefault();
			const target = document.querySelector(href);
			
			if (target) {
				const navHeight = nav ? nav.offsetHeight : 0;
				const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
				
				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
			}
		});
	});

	// ========================================
	// Scroll Animations (Intersection Observer)
	// ========================================
	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				// Optionally unobserve after animation
				// observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe elements with fade-in class
	document.querySelectorAll('.fade-in').forEach(el => {
		observer.observe(el);
	});

	// Auto-add fade-in to sections
	const sections = document.querySelectorAll('section');
	sections.forEach((section, index) => {
		// Skip hero section
		if (section.classList.contains('hero')) return;
		
		// Add staggered animation delay
		section.style.transitionDelay = `${index * 0.1}s`;
		section.classList.add('fade-in');
		observer.observe(section);
	});

	// ========================================
	// Animate cards on scroll
	// ========================================
	const cards = document.querySelectorAll('.feature, .value-card, .track-card, .number-card, .stat');
	
	const cardObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry, index) => {
			if (entry.isIntersecting) {
				// Add staggered animation
				setTimeout(() => {
					entry.target.style.opacity = '1';
					entry.target.style.transform = 'translateY(0)';
				}, index * 100);
			}
		});
	}, {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	});

	cards.forEach(card => {
		card.style.opacity = '0';
		card.style.transform = 'translateY(30px)';
		card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		cardObserver.observe(card);
	});

	// ========================================
	// Testimonial quote animation
	// ========================================
	const testimonial = document.querySelector('.testimonial');
	
	if (testimonial) {
		const testimonialObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = '1';
					entry.target.style.transform = 'scale(1)';
				}
			});
		}, { threshold: 0.2 });

		testimonial.style.opacity = '0';
		testimonial.style.transform = 'scale(0.95)';
		testimonial.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
		testimonialObserver.observe(testimonial);
	}

	// ========================================
	// Number counter animation
	// ========================================
	const numberCards = document.querySelectorAll('.number-card__value');
	
	const counterObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
				entry.target.classList.add('counted');
				animateCounter(entry.target);
			}
		});
	}, { threshold: 0.5 });

	numberCards.forEach(card => {
		counterObserver.observe(card);
	});

	function animateCounter(element) {
		const text = element.textContent;
		const hasPlus = text.includes('+');
		const hasPercent = text.includes('%');
		const numMatch = text.match(/[\d.]+/);
		
		if (!numMatch) return;
		
		const targetNum = parseFloat(numMatch[0]);
		const duration = 2000;
		const startTime = performance.now();
		
		function update(currentTime) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			
			// Easing function
			const easeOutQuart = 1 - Math.pow(1 - progress, 4);
			const currentNum = targetNum * easeOutQuart;
			
			let displayNum;
			if (targetNum % 1 === 0) {
				displayNum = Math.round(currentNum);
			} else {
				displayNum = currentNum.toFixed(1);
			}
			
			let display = '';
			if (hasPlus) display += '+';
			display += displayNum;
			if (hasPercent) display += '%';
			if (text.includes('week')) display = '1 week';
			
			element.textContent = display;
			
			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}
		
		requestAnimationFrame(update);
	}

	// ========================================
	// Parallax effect for hero
	// ========================================
	const hero = document.querySelector('.hero');
	
	if (hero) {
		window.addEventListener('scroll', () => {
			const scrolled = window.pageYOffset;
			const heroHeight = hero.offsetHeight;
			
			if (scrolled < heroHeight) {
				const parallax = scrolled * 0.3;
				hero.style.transform = `translateY(${parallax}px)`;
				hero.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
			}
		});
	}

	// ========================================
	// Hover effects for AI icons
	// ========================================
	const aiIcons = document.querySelectorAll('.ai-icon');
	
	aiIcons.forEach(icon => {
		icon.addEventListener('mouseenter', function() {
			// Pause animation on hover
			this.style.animationPlayState = 'paused';
		});
		
		icon.addEventListener('mouseleave', function() {
			this.style.animationPlayState = 'running';
		});
	});

	// ========================================
	// Credibility bar animation
	// ========================================
	const credibilityItems = document.querySelectorAll('.credibility__item');
	
	const credibilityObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const items = entry.target.querySelectorAll('.credibility__item');
				items.forEach((item, index) => {
					setTimeout(() => {
						item.style.opacity = '1';
						item.style.transform = 'translateY(0)';
					}, index * 150);
				});
			}
		});
	}, { threshold: 0.3 });

	const credibilitySection = document.querySelector('.credibility');
	if (credibilitySection) {
		credibilityItems.forEach(item => {
			item.style.opacity = '0';
			item.style.transform = 'translateY(20px)';
			item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
		});
		credibilityObserver.observe(credibilitySection);
	}

	// ========================================
	// Active nav link highlighting
	// ========================================
	const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
	const navSections = document.querySelectorAll('section[id]');

	function updateActiveNav() {
		const scrollPos = window.pageYOffset + 100;

		navSections.forEach(section => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const sectionId = section.getAttribute('id');

			if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
				navLinks.forEach(link => {
					link.classList.remove('active');
					if (link.getAttribute('href') === `#${sectionId}`) {
						link.classList.add('active');
					}
				});
			}
		});
	}

	window.addEventListener('scroll', updateActiveNav);

	// ========================================
	// Typing effect for hero (optional enhancement)
	// ========================================
	const heroSubtitle = document.querySelector('.hero__subtitle');
	
	if (heroSubtitle && window.innerWidth > 768) {
		const text = heroSubtitle.textContent;
		heroSubtitle.textContent = '';
		heroSubtitle.style.visibility = 'visible';
		
		let i = 0;
		function typeWriter() {
			if (i < text.length) {
				heroSubtitle.textContent += text.charAt(i);
				i++;
				setTimeout(typeWriter, 20);
			}
		}
		
		// Start typing after a short delay
		setTimeout(typeWriter, 500);
	}

	// ========================================
	// Console Easter Egg
	// ========================================
	console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold;');
	console.log('%cInterested in how this site was built? Let\'s chat: contact@arlenkumar.com', 'font-size: 14px; color: #8b5cf6;');
	console.log('%c🚀 Building the infrastructure for AI-era discovery at Wrodium', 'font-size: 12px; color: #71717a;');
});

// ========================================
// Performance: Debounce scroll events
// ========================================
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// ========================================
// Preload critical resources
// ========================================
if ('requestIdleCallback' in window) {
	requestIdleCallback(() => {
		// Preload images that might be needed
		const images = ['chatgpt.ico', 'gemini.ico', 'perplexity.ico', 'claude.ico'];
		images.forEach(src => {
			const img = new Image();
			img.src = src;
		});
	});
}
