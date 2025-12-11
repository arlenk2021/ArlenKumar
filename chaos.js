window.onload = function(argument) {
	// Define brand names and their local favicon files
	var brands = {
		'ChatGPT': 'chatgpt.ico',
		'Perplexity': 'perplexity.ico',
		'Claude': 'claude.ico',
		'Gemini': 'gemini.ico'
	};

	var brandNames = "ChatGPT Perplexity Claude Gemini";
	var lyric = "";
	for (var i = 0; i < 100; i++) {
		lyric += brandNames + " ";
	}

	var words = {};
	var words_attr = [];
	var images = {};

	string_handle(lyric);

	var canvas = document.getElementById('c');
	if (!canvas) {
		console.error('Canvas not found');
		return;
	}

	// Get the section dimensions
	var section = canvas.closest('.chaos-section');
	var sectionHeight = section ? section.offsetHeight : 600;
	var sectionWidth = section ? section.offsetWidth : window.innerWidth;
	
	canvas.width = sectionWidth || window.innerWidth;
	canvas.height = sectionHeight || 600;
	
	// Ensure canvas fits within section
	canvas.style.width = '100%';
	canvas.style.height = '100%';

	if (canvas.getContext) {
		var c = canvas.getContext('2d'),
			w = canvas.width,
			h = canvas.height;

		console.log('Canvas dimensions:', w, h);
		console.log('Words count:', Object.keys(words).length);

		// Load all images with proper closure handling
		var imagesLoaded = 0;
		var totalImages = Object.keys(brands).length;

		function loadImage(brandName, filename) {
			var img = new Image();
			img.onload = function() {
				console.log('Loaded:', brandName);
				imagesLoaded++;
				images[brandName] = img;
				if (imagesLoaded === totalImages) {
					startAnimation();
				}
			};
			img.onerror = function() {
				console.error('Failed to load:', brandName);
				// Create a fallback colored rectangle
				var fallback = document.createElement('canvas');
				fallback.width = 32;
				fallback.height = 32;
				var ctx = fallback.getContext('2d');
				ctx.fillStyle = '#00A1E0';
				ctx.fillRect(0, 0, 32, 32);
				ctx.fillStyle = '#fff';
				ctx.font = '20px Arial';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(brandName.charAt(0), 16, 16);
				images[brandName] = fallback;
				imagesLoaded++;
				if (imagesLoaded === totalImages) {
					startAnimation();
				}
			};
			img.src = filename; // Use local file
		}

		// Load each image from local files
		for (var brandName in brands) {
			loadImage(brandName, brands[brandName]);
		}

		function startAnimation() {
			console.log('Starting animation with', Object.keys(images).length, 'images');
			
			// Constructor for Icon
			Icon = function(key) {
				this.brand = key;
				this.x = Math.random() * w;
				this.y = Math.random() * h;
				this.size = Math.max(words[key] * 0.8, 15); // Smaller size, min 15px
				this.width = this.size;
				this.height = this.size;
				// Slower, more varied movement
				this.vx = (Math.random() - 0.5) * 0.3; // Random velocity between -0.15 and 0.15
				this.vy = (Math.random() - 0.5) * 0.3;
				// Pull target (center-right of screen, where "Google" would be)
				this.targetX = w * 0.75;
				this.targetY = h * 0.5;
				this.pullStrength = 0.01; // Weaker pull for slower movement
				this.angle = Math.random() * Math.PI * 2; // Random starting angle
				this.angleSpeed = (Math.random() - 0.5) * 0.01; // Slow rotation
			}

			for (var key in words) {
				if (brands[key]) { // Only create icons for brands with images
					words_attr.push(new Icon(key));
				}
			}

			console.log('Icons created:', words_attr.length);

			if (words_attr.length === 0) {
				console.error('No icons created!');
				return;
			}

			function animation() {
				for (var i = 0; i < words_attr.length; i++) {
					var icon = words_attr[i];
					var img = images[icon.brand];
					
					if (img) {
						try {
							if (img instanceof HTMLCanvasElement) {
								// It's a fallback canvas
								c.drawImage(img, icon.x, icon.y, icon.size, icon.size);
							} else if (img.complete && img.naturalHeight !== 0) {
								// It's a loaded image
								c.drawImage(img, icon.x, icon.y, icon.size, icon.size);
							}
							icon.width = icon.size;
							icon.height = icon.size;
						} catch(e) {
							console.error('Error drawing image:', e);
						}
					}
				}
				move();
			}

			function move() {
				for (var i = 0; i < words_attr.length; i++) {
					var icon = words_attr[i];
					
					// Calculate pull force towards center-right (Google position)
					var dx = icon.targetX - icon.x;
					var dy = icon.targetY - icon.y;
					var distance = Math.sqrt(dx * dx + dy * dy);
					
					// Normalize and apply pull with smoother, slower movement
					if (distance > 0) {
						var pullX = (dx / distance) * icon.pullStrength * 50;
						var pullY = (dy / distance) * icon.pullStrength * 50;
						
						// Apply pull force gradually
						icon.vx += pullX;
						icon.vy += pullY;
						
						// Stronger damping for smoother, slower movement
						icon.vx *= 0.95;
						icon.vy *= 0.95;
					}
					
					// Add slight orbital/curved movement
					icon.angle += icon.angleSpeed;
					var orbitX = Math.cos(icon.angle) * 0.2;
					var orbitY = Math.sin(icon.angle) * 0.2;
					icon.vx += orbitX;
					icon.vy += orbitY;
					
					// Update position
					icon.x += icon.vx;
					icon.y += icon.vy;
					
					// Keep icons within bounds with smooth wrapping
					if (icon.x < -icon.width) {
						icon.x = w;
						icon.y = Math.random() * h;
						icon.vx = (Math.random() - 0.5) * 0.3;
						icon.vy = (Math.random() - 0.5) * 0.3;
					} else if (icon.x > w) {
						icon.x = -icon.width;
						icon.y = Math.random() * h;
						icon.vx = (Math.random() - 0.5) * 0.3;
						icon.vy = (Math.random() - 0.5) * 0.3;
					}
					
					if (icon.y < 0) {
						icon.y = 0;
						icon.vy *= -0.8;
					} else if (icon.y > h - icon.height) {
						icon.y = h - icon.height;
						icon.vy *= -0.8;
					}
				}
			}

			// Start animation loop
			var animInterval = setInterval(function() {
				c.clearRect(0, 0, w, h);
				animation();
			}, 50);

			// Handle window resize
			window.addEventListener('resize', function() {
				clearInterval(animInterval);
				var newSectionHeight = section ? section.offsetHeight : window.innerHeight;
				canvas.width = window.innerWidth;
				canvas.height = newSectionHeight || 600;
				w = canvas.width;
				h = canvas.height;
				// Restart animation
				animInterval = setInterval(function() {
					c.clearRect(0, 0, w, h);
					animation();
				}, 50);
			});
		}
	}

	function string_handle(str) {
		var split_str = str.split(" ");
		var word_array = [];
		var word_count = [];

		for (var i = 0; i < split_str.length; i++) {
			if (!split_str[i]) continue; // Skip empty strings
			var check = true;
			for (var j = 0; j < word_array.length; j++) {
				if (split_str[i] == word_array[j]) {
					word_count[j]++;
					check = false;
					break;
				}
			}
			if (check) {
				word_array.push(split_str[i]);
				word_count.push(1);
			}
		}
		for (var i = 0; i < word_array.length; i++) {
			words[word_array[i]] = word_count[i];
		}
		return words;
	}
}
