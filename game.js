// List of enemy images
const enemyImages = [
    'images/thug.png',
    'images/venom-original.png',
    'images/doctor-octopus.png',
    'images/goblin.png',
    'images/mysterio.png',
    'images/sandman.png'
];

const animationContainer = document.querySelector('.animation-container');
let enemies = [];
let gameInterval;
let spawnInterval;

function spawnEnemy() {
    const enemy = document.createElement('img');
    const randomIndex = Math.floor(Math.random() * enemyImages.length);
    enemy.src = enemyImages[randomIndex];
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.random() * 100}%`;
    enemy.style.top = '-100px'; // Start off-screen
    animationContainer.appendChild(enemy);
    enemies.push(enemy);
}

function animateEnemies() {
    enemies.forEach(enemy => {
        const currentTop = parseFloat(enemy.style.top);
        enemy.style.top = `${currentTop + 5}px`; // Adjust fall speed

        if (isCollision(enemy, imgElement)) {
            gameOver();
        }

        if (currentTop > window.innerHeight) {
            enemy.remove();
            enemies = enemies.filter(e => e !== enemy);
        }
    });
}

function isCollision(enemy, spiderman) {
    const enemyRect = enemy.getBoundingClientRect();
    const spidermanRect = spiderman.getBoundingClientRect();

    return !(
        enemyRect.top > spidermanRect.bottom ||
        enemyRect.bottom < spidermanRect.top ||
        enemyRect.left > spidermanRect.right ||
        enemyRect.right < spidermanRect.left
    );
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    enemies.forEach(enemy => enemy.remove());
    enemies = [];

    const gameOverMessage = document.createElement('div');
    gameOverMessage.innerText = 'Game Over';
    gameOverMessage.classList.add('game-over');
    document.body.appendChild(gameOverMessage);

    setTimeout(() => {
        gameOverMessage.style.opacity = 0;
        setTimeout(() => {
            gameOverMessage.remove();
            startGame();
        }, 2000);
    }, 2000);
}

function startGame() {
    gameInterval = setInterval(animateEnemies, 50); // Adjust frame rate
    spawnInterval = setInterval(spawnEnemy, 1000); // Adjust spawn rate
}

// Initial game start
startGame();

// CSS for the game
const style = document.createElement('style');
style.innerHTML = `
.enemy {
    position: absolute;
    width: 64px; /* Adjust enemy size */
    height: 64px; /* Adjust enemy size */
    object-fit: contain;
}

.game-over {
    font-family: 'Mightyspidey', sans-serif;
    color: red;
    font-size: 48px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 10px;
    opacity: 1;
    transition: opacity 1s ease-in-out;
    z-index: 20; /* Ensure it's on top */
}
`;
document.head.appendChild(style);


const webContainer = document.querySelector('.web-container');

function shootWeb(event) {
    const web = document.createElement('img');
    web.src = 'images/web.png';
    web.classList.add('web');

    const spidermanRect = imgElement.getBoundingClientRect();
    const webStartX = spidermanRect.left + spidermanRect.width / 2;
    const webStartY = spidermanRect.top + spidermanRect.height / 2;

    web.style.left = `${webStartX}px`;
    web.style.top = `${webStartY}px`;

    const targetX = event.clientX;
    const targetY = event.clientY;

    const angle = Math.atan2(targetY - webStartY, targetX - webStartX);

    web.style.transform = `rotate(${angle}rad)`;

    // Append the web to the web container and log its creation
    webContainer.appendChild(web);
    console.log('Web created at:', webStartX, webStartY);

    const webSpeed = 15; // Adjust speed as needed
    const webInterval = setInterval(() => {
        const currentX = parseFloat(web.style.left);
        const currentY = parseFloat(web.style.top);
        web.style.left = `${currentX + webSpeed * Math.cos(angle)}px`;
        web.style.top = `${currentY + webSpeed * Math.sin(angle)}px`;

        // Log web's current position
        console.log('Web position:', currentX, currentY);

        // Check for collision with enemies
        enemies.forEach(enemy => {
            if (isCollision(web, enemy)) {
                enemy.remove();
                enemies = enemies.filter(e => e !== enemy);
                clearInterval(webInterval);
                web.remove();
            }
        });

        // Remove web if it goes off-screen
        if (currentX < 0 || currentX > window.innerWidth || currentY < 0 || currentY > window.innerHeight) {
            clearInterval(webInterval);
            web.remove();
        }
    }, 20); // Adjust frame rate for smoother animation
}

window.addEventListener('click', shootWeb);

function isCollision(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Add this to your `startGame` function to reset the event listeners
function startGame() {
    gameInterval = setInterval(animateEnemies, 50); // Adjust frame rate
    spawnInterval = setInterval(spawnEnemy, 1000); // Adjust spawn rate

    window.removeEventListener('click', shootWeb); // Remove existing listeners
    window.addEventListener('click', shootWeb); // Add the listener
}

// Initial game start
startGame();
