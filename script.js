document.addEventListener('DOMContentLoaded', () => {
	gsap.registerPlugin(ScrollTrigger);

	const lenis = new Lenis({
		duration: 1.2,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
	});
	
	lenis.on('scroll', ScrollTrigger.update);
	
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});
	gsap.ticker.lagSmoothing(0);

	const maskImages = gsap.utils.toArray('.images .mask-img');
	const totalImages = maskImages.length;
	
	console.log('Total mask images:', totalImages); // Debug
	
	// Scroll distance - reduced for faster image transitions
	const scrollDistance = window.innerHeight * 5; // Faster scrolling through images

	// Set initial state - all mask images should be fully masked initially (completely hidden)
	maskImages.forEach((img, index) => {
		gsap.set(img, {
			maskImage: 'linear-gradient(90deg, transparent 50%, transparent 50%)',
			WebkitMaskImage: 'linear-gradient(90deg, transparent 50%, transparent 50%)',
			opacity: 1,
			zIndex: 10 + index
		});
	});

	ScrollTrigger.create({
		trigger: '.hero',
		start: 'top top',
		end: `+=${scrollDistance}px`,
		pin: true,
		pinSpacing: true,
		scrub: 0.5, // Smoother and faster animation
		onUpdate: (self) => {
			const progress = self.progress;

			// Each image gets its own segment of the scroll progress
			maskImages.forEach((img, index) => {
				const imageStart = index / totalImages;
				const imageEnd = (index + 1) / totalImages;
				const imageDuration = imageEnd - imageStart;

				let imageProgress = 0;

				if (progress >= imageStart && progress <= imageEnd) {
					// Image is currently animating
					imageProgress = (progress - imageStart) / imageDuration;
				} else if (progress > imageEnd) {
					// Image has finished animating - fully revealed
					imageProgress = 1;
				} else {
					// Image hasn't started yet - fully masked (hidden)
					imageProgress = 0;
				}

				// Calculate gradient values for reveal animation
				// Starts from center (0% visible) and expands outward to fully visible
				const centerPoint = 50;
				const expandAmount = imageProgress * 50; // Expands from 0% to 50% in each direction
				const leftEdge = Math.max(0, centerPoint - expandAmount);
				const rightEdge = Math.min(100, centerPoint + expandAmount);
				
				// Create mask gradient - when progress is 0, image is hidden, when 1, fully visible
				let maskValue;
				if (imageProgress === 0) {
					// Fully masked (completely hidden)
					maskValue = 'linear-gradient(90deg, transparent 50%, transparent 50%)';
				} else if (imageProgress === 1) {
					// Fully revealed
					maskValue = 'linear-gradient(90deg, black 0%, black 100%)';
				} else {
					// Animating - reveal from center outward
					const angle = 90 + (imageProgress * 40);
					maskValue = `linear-gradient(${angle}deg, black ${leftEdge}%, transparent ${leftEdge}%, transparent ${rightEdge}%, black ${rightEdge}%)`;
				}
				
				gsap.set(img, {
					maskImage: maskValue,
					WebkitMaskImage: maskValue
				});
			});
		}
	});

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);
});

// GSAP header animation
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
	const heroTitle = document.querySelector('.hero-title h1');
	const heroSubtitle = document.querySelector('.hero-subtitle');
	const heroDescription = document.querySelector('.hero-description');
	
	if (heroTitle && heroSubtitle && heroDescription) {
		gsap.from([heroTitle, heroSubtitle, heroDescription], {
			opacity: 0,
			y: 20,
			duration: 0.8,
			delay: 0.2,
			stagger: 0.4,
			ease: "power2.out"
		});
	}
});
