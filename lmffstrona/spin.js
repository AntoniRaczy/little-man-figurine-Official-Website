const TOTAL_FRAMES = 43;
const BASE_SPEED = 55;
const FAST_SPEED = 10;

function getFrameSrc(index) {
    const formattedIndex = String(index).padStart(2, '0');
    return `fots/ezgif-split/frame_${formattedIndex}_delay-0.1s.gif`;
}

const imgElement = document.getElementById('skurw-frame');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

let currentFrame = 0;
let direction = 1;
let currentSpeed = BASE_SPEED;
let animationInterval = null;

function tick() {
    currentFrame = (currentFrame + direction + TOTAL_FRAMES) % TOTAL_FRAMES;
    imgElement.src = getFrameSrc(currentFrame);
}

function startAnimation() {
    clearInterval(animationInterval);
    animationInterval = setInterval(tick, currentSpeed);
}

function setupButton(button, targetDirection) {
    let isHolding = false;
    let holdTimeout = null;

    const onPress = (e) => {
        e.preventDefault();

        if (e.cancelable) e.preventDefault();

        button.classList.add('active');

        direction = targetDirection;

        holdTimeout = setTimeout(() => {
            isHolding = true;
            currentSpeed = FAST_SPEED;
            startAnimation();
        }, 100);
    };

    const onRelease = (e) => {
        if (e.cancelable) e.preventDefault();

        button.classList.remove('active');
        clearTimeout(holdTimeout);

        if (isHolding) {
            isHolding = false;
            currentSpeed = BASE_SPEED;
            startAnimation();
        } else {
            startAnimation();
        }
    };

    button.addEventListener('mousedown', onPress);
    button.addEventListener('mouseup', onRelease);
    button.addEventListener('mouseleave', onRelease);

    button.addEventListener('touchstart', onPress, { passive: false });
    button.addEventListener('touchend', onRelease, { passive: false });
    button.addEventListener('touchcancel', onRelease, { passive: false });
}

setupButton(btnLeft, -1);
setupButton(btnRight, 1);

startAnimation();

function preloadFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
    }
    console.log("Wszystkie klatki zostały załadowane do pamięci podręcznej!");
}

preloadFrames();