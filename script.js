const components = document.querySelectorAll('.component');
const gameContainer = document.getElementById('gameContainer');
const finishButton = document.getElementById('finishButton');
const congratsMessage = document.getElementById('congratsMessage');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

let score = 0;
let timeLeft = 30;
let gameEnded = false;

// Correct positions for each component
const correctPositions = {
    cpu: { top: 200, left: 300 },
    gpu: { top: 250, left: 400 },
    ram: { top: 50, left: 500 },
    psu: { top: 500, left: 100 },
    hdd: { top: 400, left: 600 },
    motherboard: { top: 100, left: 200 },
    fan: { top: 320, left: 500 },
    opticalDrive: { top: 450, left: 300 }
};

components.forEach(component => {
    component.addEventListener('dragstart', dragStart);
    component.addEventListener('dragend', dragEnd);
});

gameContainer.addEventListener('dragover', dragOver);
gameContainer.addEventListener('drop', dropComponent);

finishButton.addEventListener('click', checkCompletion);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragEnd(e) {
    e.target.style.cursor = 'grab';
}

function dragOver(e) {
    e.preventDefault();
}

function dropComponent(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const component = document.getElementById(id);

    const mouseX = e.clientX - gameContainer.offsetLeft;
    const mouseY = e.clientY - gameContainer.offsetTop;

    component.style.left = `${mouseX - component.offsetWidth / 2}px`;
    component.style.top = `${mouseY - component.offsetHeight / 2}px`;

    if (checkIfComponentInPlace(component)) {
        component.style.cursor = 'default';
        component.draggable = false;
        updateScore(10); // Award points for correct placement
    } else {
        updateScore(-5); // Penalize for incorrect placement
        endGame('Incorrect placement! Game Over.');
    }
}

function checkIfComponentInPlace(component) {
    const id = component.id;
    const tolerance = 20;
    const correctPosition = correctPositions[id];

    if (
        Math.abs(parseInt(component.style.top) - correctPosition.top) < tolerance &&
        Math.abs(parseInt(component.style.left) - correctPosition.left) < tolerance
    ) {
        component.style.top = `${correctPosition.top}px`;
        component.style.left = `${correctPosition.left}px`;
        return true;
    }
    return false;
}

function checkCompletion() {
    if (!gameEnded) {
        let allCorrect = true;

        components.forEach(component => {
            if (!checkIfComponentInPlace(component)) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            congratsMessage.style.display = 'block';
            clearInterval(timerInterval);
        } else {
            alert('Some components are not in the correct positions.');
        }
    }
}

function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `Score: ${score}`;
}

function endGame(message) {
    alert(message);
    gameEnded = true;
    clearInterval(timerInterval);
    components.forEach(component => {
        component.draggable = false;
    });
}

const timerInterval = setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
    } else {
        endGame('Time is up! Game Over.');
    }
}, 1000);
