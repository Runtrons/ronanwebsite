const images = [
    'images/running-change-step.png',
    'images/running-left-step.png',
    'images/running-right-step.png'
];

const standingImage = 'images/standing.png';
let currentIndex = 0;
let isMoving = false;
let isJumping = false;
let direction = 'right'; // Keep track of direction

const imgElement = document.getElementById('running-animation');
const messageElement = document.getElementById('message');
const controlsElement = document.getElementById('controls');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const jumpButton = document.getElementById('jump-button');
const buildingElement = document.getElementById('building');

function changeImage() {
    if (!isMoving) return; // Only change image if moving
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
}

function moveSpiderman(direction) {
    isMoving = true;
    imgElement.src = images[currentIndex]; // Ensure running animation is shown
    clearTimeout(standingTimeout);
    clearInterval(standingInterval);
    const currentTransform = imgElement.style.transform || 'translateX(0px) translateY(0px)';
    let translateX = currentTransform.match(/translateX\(([^)]+)\)/);
    translateX = translateX ? parseFloat(translateX[1]) : 0;

    if (direction === 'right') {
        translateX += 10; // Adjust movement speed (faster)
        imgElement.style.transform = `translateX(${translateX}px) translateY(0px) scaleX(1)`;
    } else if (direction === 'left') {
        translateX -= 10; // Adjust movement speed (faster)
        imgElement.style.transform = `translateX(${translateX}px) translateY(0px) scaleX(-1)`;
    }
}

function jumpSpiderman() {
    if (isJumping) return; // Prevent multiple jumps
    isJumping = true;
    const initialBottom = parseFloat(imgElement.style.bottom);
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        jumpHeight += 10; // Adjust jump speed (faster)
        imgElement.style.bottom = `${initialBottom + jumpHeight}px`;
        if (jumpHeight >= 150) { // Max jump height
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                jumpHeight -= 10; // Adjust fall speed (faster)
                imgElement.style.bottom = `${initialBottom + jumpHeight}px`;
                if (jumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                    imgElement.style.bottom = `${initialBottom}px`; // Reset to initial position
                    if (!isMoving) {
                        imgElement.src = standingImage;
                    }
                }
            }, 20); // Faster frame rate for smoother animation
        }
    }, 20); // Faster frame rate for smoother animation
}

function jumpAndMoveSpiderman() {
    if (isJumping) return; // Prevent multiple jumps
    isJumping = true;
    const initialBottom = parseFloat(imgElement.style.bottom);
    let jumpHeight = 0;
    let translateX = parseFloat(imgElement.style.transform.match(/translateX\(([^)]+)\)/)[1]) || 0;
    const jumpInterval = setInterval(() => {
        jumpHeight += 10; // Adjust jump speed (faster)
        translateX += direction === 'right' ? 5 : -5; // Adjust horizontal speed during jump
        imgElement.style.bottom = `${initialBottom + jumpHeight}px`;
        imgElement.style.transform = `translateX(${translateX}px) translateY(0px) scaleX(${direction === 'right' ? 1 : -1})`;
        if (jumpHeight >= 150) { // Max jump height
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                jumpHeight -= 10; // Adjust fall speed (faster)
                translateX += direction === 'right' ? 5 : -5; // Adjust horizontal speed during fall
                imgElement.style.bottom = `${initialBottom + jumpHeight}px`;
                imgElement.style.transform = `translateX(${translateX}px) translateY(0px) scaleX(${direction === 'right' ? 1 : -1})`;
                if (jumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                    imgElement.style.bottom = `${initialBottom}px`; // Reset to initial position
                    if (!isMoving) {
                        imgElement.src = standingImage;
                    }
                }
            }, 20); // Faster frame rate for smoother animation
        }
    }, 20); // Faster frame rate for smoother animation
}

function adjustSpidermanPosition() {
    const buildingRect = buildingElement.getBoundingClientRect();
    const spidermanHeight = imgElement.clientHeight;
    const offset = 60; // Adjust this value to fine-tune the position, use negative for up and positive for down
    const bottomPosition = window.innerHeight - buildingRect.top - spidermanHeight + offset;
    imgElement.style.bottom = `${bottomPosition}px`;

    // Adjust building size based on screen width
    if (window.innerWidth > 1024) {
        buildingElement.style.width = '45%'; // Adjust width for larger screens
    } else {
        buildingElement.style.width = '80%'; // Default width
    }
}

function resetToStanding() {
    if (!isJumping) {
        imgElement.src = standingImage;
        isMoving = false;
    }
}

setInterval(changeImage, 100); // Faster animation

let leftInterval, rightInterval, standingInterval, standingTimeout;

window.addEventListener('resize', () => {
    adjustSpidermanPosition();
    if (window.innerWidth > 1024) {
        messageElement.style.display = 'block';
        controlsElement.style.display = 'none';
    } else {
        messageElement.style.display = 'none';
        controlsElement.style.display = 'flex';
    }
});

window.addEventListener('keydown', (event) => {
    clearTimeout(standingTimeout); // Clear the timeout to prevent standing too early
    if (event.key === 'ArrowRight') {
        moveSpiderman('right');
        direction = 'right';
    } else if (event.key === 'ArrowLeft') {
        moveSpiderman('left');
        direction = 'left';
    } else if (event.key === 'ArrowUp') {
        if (isMoving) {
            jumpAndMoveSpiderman();
        } else {
            jumpSpiderman();
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
        standingTimeout = setTimeout(resetToStanding, 300); // Shorter delay before resetting to standing
    }
});

leftButton.addEventListener('mousedown', () => {
    clearTimeout(standingTimeout); // Clear the timeout to prevent standing too early
    leftInterval = setInterval(() => moveSpiderman('left'), 50); // Faster interval for smoother animation
});

leftButton.addEventListener('mouseup', () => {
    clearInterval(leftInterval);
    standingTimeout = setTimeout(resetToStanding, 300); // Shorter delay before resetting to standing
});
leftButton.addEventListener('mouseleave', () => {
    clearInterval(leftInterval);
    standingTimeout = setTimeout(resetToStanding, 300); // Shorter delay before resetting to standing
});

rightButton.addEventListener('mousedown', () => {
    clearTimeout(standingTimeout); // Clear the timeout to prevent standing too early
    rightInterval = setInterval(() => moveSpiderman('right'), 50); // Faster interval for smoother animation
});

rightButton.addEventListener('mouseup', () => {
    clearInterval(rightInterval);
    standingTimeout = setTimeout(resetToStanding, 300); // Shorter delay before resetting to standing
});
rightButton.addEventListener('mouseleave', () => {
    clearInterval(rightInterval);
    standingTimeout = setTimeout(resetToStanding, 300); // Shorter delay before resetting to standing
});

jumpButton.addEventListener('mousedown', () => {
    clearTimeout(standingTimeout); // Clear the timeout to prevent standing too early
    if (isMoving) {
        jumpAndMoveSpiderman();
    } else {
        jumpSpiderman();
    }
});

// Initial check
adjustSpidermanPosition();
imgElement.style.left = '50%';
if (window.innerWidth > 1024) {
    messageElement.style.display = 'block';
    controlsElement.style.display = 'none';
} else {
    messageElement.style.display = 'none';
    controlsElement.style.display = 'flex';
}
