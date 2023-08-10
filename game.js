const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
let canvasSize;
let elementSize;

const playerPosition = {
    x: undefined,
    y: undefined,
}

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function startGame(){
    game.font = elementSize + 'px Verdana';
    game.textAlign = 'end';
    const map = maps[1];
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
            }

            game.fillText(emoji, posX, posY);
        });
    });

    game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y);
}

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

function movePlayer(){
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
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
    playerPosition.y -= elementSize;
    startGame();
}
function moveDown(){
    playerPosition.y += elementSize;
    startGame();
}
function moveLeft(){
    playerPosition.x -= elementSize;
    startGame();
}
function moveRight(){
    playerPosition.x += elementSize;
    startGame();
}