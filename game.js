const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

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
    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval( showTime,100);
        showRecord();
    }

    showLives();

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

    const giftColisionX = playerPosition.x.toFixed() == giftPosition.x.toFixed();
    const giftColisionY = playerPosition.y.toFixed() == giftPosition.y.toFixed();
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
        timeStart = undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    console.log('Vidas: ' + lives)
    startGame();

}

function gameWin (){
    console.log('Juego Terminado - Ganaste!');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){
        const playerTime = Date.now() - timeStart;
        if(recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'SUPERASTE EL RECORD';
        }else {
            pResult.innerHTML = 'Lo siento, no superaste el record';
        }
    }else{
        localStorage.setItem('record_time', playerTime);
    }
    console.log({recordTime, playerTime});
}

function showLives(){

    spanLives.innerHTML = "";
    for (let i = 0; i<lives; i++){
        spanLives.append(emojis['HEART']);
    }
}

function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
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
    let posActual = playerPosition.y.toFixed(2) - elementSize;
    if(posActual>= elementSize){
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