const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
let canvasSize;
let elementSize;
let level = 0;
let lives = 3;


const playerPosition = {
    x: undefined,
    y: undefined,
}
const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemyPositions = [];

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function setCanvasSize(){
    if(window.innerHeight > innerWidth){
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }
    
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementSize = canvasSize /10;

    startGame();
}

function startGame(){
    game.font = elementSize + 'px Verdana';
    game.textAlign = 'end';

    enemyPositions = [];

    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }

    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map((row) => row.trim().split(''));

    game.clearRect(0,0, canvasSize,canvasSize);

    mapRowsCols.forEach((row, rowI) =>{
        row.forEach((col, colI) =>{
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1);
            const posY = elementSize * (rowI + 1);

            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY; 
                }
            }else if(col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            }else if(col == 'X'){
                enemyPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer(){

    const giftColisionX = Math.round(playerPosition.x) == Math.round(giftPosition.x);
    const giftColisionY = Math.round(playerPosition.y) == Math.round(giftPosition.y);
    const giftColision = giftColisionX && giftColisionY;

    if (giftColision){
        levelWin();
    }

    const enemyColision = enemyPositions.find(enemy => {
        const enemyColisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        const enemyColisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyColisionX && enemyColisionY;
    });

    if (enemyColision){
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin(){
    console.log('Subiste de nivel');
    level++;
    startGame();
}

function levelFail(){
    lives--;
    
    if(lives <= 0){
        level = 0;
        lives = 3;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    console.log('Vidas: ' + lives)
    startGame();

}

function gameWin (){
    console.log('Juego Terminado - Ganaste!');
}


window.addEventListener('keydown', moveByKeys )
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);

function moveByKeys(event){
    if (event.key == 'ArrowUp'){
        moveUp();
    }else if(event.key == 'ArrowLeft'){
        moveLeft();
    }else if (event.key == 'ArrowRight'){
        moveRight();
    }else if(event.key == 'ArrowDown'){
        moveDown();
    }
}

function moveUp(){
    let posActual = playerPosition.y - elementSize;
    if(posActual>=elementSize){
        playerPosition.y -= elementSize;
    }
    startGame();
}
function moveDown(){
    let posActual = playerPosition.y + elementSize;
    if(posActual<=canvasSize){
        playerPosition.y += elementSize;
        startGame();
    }
}
function moveLeft(){
    let posActual = playerPosition.x - elementSize;
    if(posActual>=elementSize){
        playerPosition.x -= elementSize;
        startGame();
    }
}
function moveRight(){
    let posActual = playerPosition.x + elementSize;
    if(posActual<=canvasSize){
        playerPosition.x += elementSize;
        startGame();
    }
}