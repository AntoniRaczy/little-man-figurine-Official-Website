const TOTAL_FRAMES = 43;
const FRICTION = 0.99;
const IDLE_SPEED_MAGNITUDE = 0.25;
const ACCELERATION = 0.25;
const MAX_SPEED = 13;

function getFrameSrc(index) {
    const formattedIndex = String(index).padStart(2, '0');
    return `/fots/ezgif-split/frame_${formattedIndex}_delay-0.1s.gif`;
}

const imgElement = document.getElementById('skurw-frame');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

let currentFrame = 0;
let targetIdleSpeed = IDLE_SPEED_MAGNITUDE; 
let speed = targetIdleSpeed;
let frameAccumulator = 0;

function updateAnimation() {
    speed = targetIdleSpeed + (speed - targetIdleSpeed) * FRICTION;

    if (speed !== 0) {
        frameAccumulator += speed;

        if (frameAccumulator >= 1) {
            const framesToMove = Math.floor(frameAccumulator);
            currentFrame = (currentFrame + framesToMove + TOTAL_FRAMES) % TOTAL_FRAMES;
            frameAccumulator -= framesToMove;
            imgElement.src = getFrameSrc(currentFrame);
        } else if (frameAccumulator <= -1) {
            const framesToMove = Math.ceil(frameAccumulator);
            currentFrame = (currentFrame + framesToMove + TOTAL_FRAMES) % TOTAL_FRAMES;
            frameAccumulator -= framesToMove;
            imgElement.src = getFrameSrc(currentFrame);
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

requestAnimationFrame(updateAnimation);

function preloadFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
    }
    console.log("Wszystkie klatki zostały załadowane do pamięci podręcznej!");
}

preloadFrames();