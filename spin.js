const TOTAL_FRAMES = 104;
const FRICTION = 0.99;
const IDLE_SPEED_MAGNITUDE = 0.28;
const ACCELERATION = 0.25;
const MAX_SPEED = 10;

function getFrameSrc(index) {
    const formattedIndex = String(index).padStart(3, '0');
    return `/fots/ezgif-split1/frame_${formattedIndex}_delay-0.04s.gif`;
}

const canvas = document.getElementById('skurw-frame');
const ctx = canvas.getContext('2d');

const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

let currentFrame = 0;
let targetIdleSpeed = IDLE_SPEED_MAGNITUDE; 
let speed = targetIdleSpeed;
let frameAccumulator = 0;

const preloadImages = [];
let loadedCount = 0;
let isReady = false;

function preloadFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);

        img.decode().then(() => {
            loadedCount++;
            if (loadedCount === TOTAL_FRAMES) {
                isReady = true;
                console.log("Wszystkie klatki zostały załadowane do pamięci podręcznej!");

                drawFrame(currentFrame);
                requestAnimationFrame(updateAnimation);
            }
        }).catch((err) => {
            console.error(`Błąd podczas dekodowania klatki ${i}:`, err);
        });

        preloadImages[i] = img;
    }
}

function drawFrame(frameIndex) {
    const img = preloadImages[frameIndex];
    if (img) {
       if (canvas.width !== img.naturalWidth) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    }
}

function updateAnimation() {
    if (!isReady) return;

    speed = targetIdleSpeed + (speed - targetIdleSpeed) * FRICTION;

    if (speed !== 0) {
        frameAccumulator += speed;

        if (frameAccumulator >= 1) {
            const framesToMove = Math.floor(frameAccumulator);
            currentFrame = (currentFrame + framesToMove + TOTAL_FRAMES) % TOTAL_FRAMES;
            frameAccumulator -= framesToMove;
            drawFrame(currentFrame);
        } else if (frameAccumulator <= -1) {
            const framesToMove = Math.ceil(frameAccumulator);
            currentFrame = (currentFrame + framesToMove + TOTAL_FRAMES) % TOTAL_FRAMES;
            frameAccumulator -= framesToMove;
            drawFrame(currentFrame);
        }
    }
    requestAnimationFrame(updateAnimation);
}

function setupButton(button, targetDirection) {
    let isHolding = false;
    let holdTimeout = null;

    const impulse = () => {
        targetIdleSpeed = targetDirection * IDLE_SPEED_MAGNITUDE;

        speed += targetDirection * ACCELERATION;
        if (Math.abs(speed) > MAX_SPEED) {
            speed = Math.sign(speed) * MAX_SPEED;
        }
    };

    const onPress = (e) => {
        e.preventDefault();

        if (e.cancelable) e.preventDefault();
        button.classList.add('active');

        impulse();

        clearTimeout(holdTimeout);
        holdTimeout = setTimeout(() => {
            isHolding = true;
            impulse();
        }, 50);
    };

    const onRelease = (e) => {
        if (e.cancelable) e.preventDefault();
        button.classList.remove('active');

        clearTimeout(holdTimeout);
        isHolding = false;
    };

    button.addEventListener('mousedown', onPress);
    button.addEventListener('mouseup', onRelease);
    button.addEventListener('mouseleave', onRelease);

    button.addEventListener('touchstart', onPress, { passive: false });
    button.addEventListener('touchend', onRelease, { passive: false });
    button.addEventListener('touchcancel', onRelease, { passive: false });
}

setupButton(btnLeft, 1);
setupButton(btnRight, -1);


preloadFrames();