function initCursor() {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }
    
    const ctx = canvas.getContext('2d');

    // for intro motion
    let mouseMoved = false;
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;

    const pointer = {
        x: .5 * window.innerWidth,
        y: .5 * window.innerHeight,
    }

    const params = {
        pointsNumber: 40,
        widthFactor: .3,
        mouseThreshold: .6,
        spring: .4,
        friction: .5
    };

    const trail = new Array(params.pointsNumber);
    for (let i = 0; i < params.pointsNumber; i++) {
        trail[i] = {
            x: pointer.x,
            y: pointer.y,
            dx: 0,
            dy: 0,
        }
    }

    // Track mouse position continuously - use multiple event types
    const updateFromEvent = (e) => {
        mouseMoved = true;
        const x = e.pageX || e.clientX || lastMouseX;
        const y = e.pageY || e.clientY || lastMouseY;
        lastMouseX = x;
        lastMouseY = y;
        updateMousePosition(x, y);
    };

    // Multiple event listeners to ensure we catch all mouse movements
    document.addEventListener("mousemove", updateFromEvent, { capture: true, passive: true });
    document.addEventListener("mouseenter", updateFromEvent, { capture: true, passive: true });
    document.addEventListener("mouseover", updateFromEvent, { capture: true, passive: true });
    
    // Track on window as well
    window.addEventListener("mousemove", updateFromEvent, { passive: true });
    
    // Track clicks
    document.addEventListener("click", updateFromEvent, { capture: true, passive: true });
    
    // Track when mouse leaves - try to maintain position
    document.addEventListener("mouseleave", (e) => {
        // Keep tracking with last known position
        if (e.clientX !== undefined && e.clientY !== undefined) {
            updateMousePosition(e.clientX, e.clientY);
        }
    }, { capture: true, passive: true });

    // Track mouseout to catch edge cases
    document.addEventListener("mouseout", (e) => {
        if (e.relatedTarget === null) {
            // Mouse left the document, but try to use last position
            updateMousePosition(lastMouseX, lastMouseY);
        }
    }, { capture: true, passive: true });

    // Touch support
    window.addEventListener("touchmove", e => {
        mouseMoved = true;
        if (e.touches && e.touches[0]) {
            const touch = e.touches[0];
            lastMouseX = touch.pageX;
            lastMouseY = touch.pageY;
            updateMousePosition(touch.pageX, touch.pageY);
        }
    }, { passive: true });

    function updateMousePosition(eX, eY) {
        // Always update position - no clamping to allow tracking at edges
        pointer.x = eX;
        pointer.y = eY;
        // Update last known position
        lastMouseX = eX;
        lastMouseY = eY;
    }

    setupCanvas();
    update(0);

    window.addEventListener("resize", setupCanvas);

    function setupCanvas() {
        // Make canvas slightly larger to handle edge cases
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Ensure canvas covers full viewport
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }

    function update(t) {
        // for intro motion
        if (!mouseMoved) {
            pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
            pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
        }

        // Always clear and redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Ensure pointer stays within reasonable bounds for rendering
        const clampedX = Math.max(-100, Math.min(pointer.x, window.innerWidth + 100));
        const clampedY = Math.max(-100, Math.min(pointer.y, window.innerHeight + 100));

        // Use clamped position for trail calculation but allow trail to extend slightly beyond viewport
        const targetX = mouseMoved ? pointer.x : clampedX;
        const targetY = mouseMoved ? pointer.y : clampedY;
        
        trail.forEach((p, pIdx) => {
            const prev = pIdx === 0 ? { x: targetX, y: targetY } : trail[pIdx - 1];
            const spring = pIdx === 0 ? .4 * params.spring : params.spring;
            p.dx += (prev.x - p.x) * spring;
            p.dy += (prev.y - p.y) * spring;
            p.dx *= params.friction;
            p.dy *= params.friction;
            p.x += p.dx;
            p.y += p.dy;
        });

        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length - 1; i++) {
            const xc = .5 * (trail[i].x + trail[i + 1].x);
            const yc = .5 * (trail[i].y + trail[i + 1].y);
            ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
            ctx.stroke();
        }

        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
        ctx.stroke();
        
        window.requestAnimationFrame(update);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}

