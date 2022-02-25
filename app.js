const gameBoard = (() => {

    //DOM
const boardBtn = document.querySelectorAll(".box");
const restartBtn = document.querySelector("#restart");
const countPlayerOne = document.querySelector(".roundsWonPlayerOne");
const countPlayerTwo = document.querySelector(".roundsWonPlayerTwo");
const onePlayerSelection = document.querySelectorAll(".onePlayerSelectionXO");
const twoPlayer = document.querySelectorAll(".twoPlayerSelectionXO");
const modal = document.querySelector(".playerOneAndTwo");
const onePlayerModal = document.querySelector("#playerOne");
const containerBody = document.querySelector(".conteiner");


// winning combinations 
const winningCombinations = [
    ['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['1', '4', '7'], ['2', '5', '8'],['3','6','9'], ['1', '5', '9'], ['3', '5', '7']
];

// positions on the board to play with bot
let positionsOnTheBoard = ['1','2','3','4','5','6','7','8','9'];

//objet player
const Player = (name, selectXOrOParam) => {
    const namePlayer = name;
    const selectXOrO = selectXOrOParam;
    let roundsWon = 1;
    const isBot = false;
    const yourTurn = '';
    const boxClicked = [];

    const firstShift = function(){
        if(this.selectXOrO == 'X'){
            return this.yourTurn = true;
        }
        else{
            return this.yourTurn = false;
        }
    };
    const roundsWonIncrement = function(){
        return this.roundsWon++;
    }
    return {selectXOrO, yourTurn, roundsWon, firstShift, boxClicked, roundsWonIncrement, namePlayer, isBot};  
};

//
const p1 = Player('player one');
const p2 = Player('player two');

// the contents of the gameboard --- addEventListener --- BOT
boardBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if(p1.yourTurn){
            e.target.textContent = p1.selectXOrO;
            p1.boxClicked.push(e.target.id);
            e.target.disabled = true;
            p1.yourTurn = false;
            p2.yourTurn = true;
            checkWinner(p1);

            if(p2.yourTurn && p2.isBot){
                deleteUnavailableCell(positionsOnTheBoard, e.target.id)
                botPlay()
            }
        }
        else if (p2.yourTurn && p2.isBot != true){
            e.target.textContent = p2.selectXOrO;
            p2.boxClicked.push(e.target.id);
            e.target.disabled = true;
            p2.yourTurn = false;
            p1.yourTurn = true;
            checkWinner(p2);
        }
        gameTie();
    })
}); 

// button that when pressed restarts the game
restartBtn.addEventListener('click',() =>{
    restartGame();
    botPlay();
})

// checks winners and shows rounds won
function checkWinner (player){
    let checker = (arr, target) => target.every((v) => arr.includes(v))
    winningCombinations.forEach(element => {
    if(checker(player.boxClicked, element)){
        if (player == p1){
            countPlayerOne.textContent = "Rounds Won = "+ player.roundsWonIncrement();
        }
        else if (player == p2){
            countPlayerTwo.textContent = "Rounds Won = "+ player.roundsWonIncrement();
        }
        restartGame();
    }
});
}

// restart the game
const restartGame = function () {
    p1.boxClicked = [];
    p2.boxClicked = [];
    p1.firstShift();
    p2.firstShift();
    boardBtn.forEach(btn => {
        btn.textContent = '';
        btn.disabled = false;
    });
    positionsOnTheBoard = ['','1','2','3','4','5','6','7','8','9'];
    botPlay();
};

// the first player chooses whether to mark X or O
onePlayerSelection.forEach(btn => {
    btn.addEventListener('click', (e) => {
        p1.selectXOrO = e.target.value;
        if (p1.selectXOrO == 'X'){
            p2.selectXOrO = 'O';
            p1.firstShift();
        }
        else {
            p2.selectXOrO = 'X'
            p2.firstShift();
        }
        onePlayerModal.style.display="none";
    })
});

// player chooses whether to play against a player or a bot
twoPlayer.forEach(btn => {
    btn.addEventListener('click', (e) =>{
        if (p1.selectXOrO !== undefined ){
        if (e.target.id == "player"){
            modal.style.display= "none";
            containerBody.style.display= "flex";
        }
        else if(e.target.id == "bot"){
            botGame();
            modal.style.display= "none";
            containerBody.style.display= "flex";
        }
    }
    })
})

// tie
function gameTie (){
    if ((p1.boxClicked.length + p2.boxClicked.length) == 9){
        restartGame();
    }
};

// function called when selecting the bot as player two
const botGame = function (){
    p2.isBot = true;
    p2.firstShift()
    botPlay()
}

// the botgame function chooses a randon number, verifies that the position equal to the number is free and dials X or O depending on the player's selection. 
const botPlay = function (){
    if(p2.yourTurn && p2.isBot){
    let posicionBot = Math.floor(Math.random() * 9);
    posicionBot = posicionBot.toString();
        if (positionsOnTheBoard.includes(posicionBot)){
            deleteUnavailableCell(positionsOnTheBoard, posicionBot)
            console.log(posicionBot);
            boardBtn.forEach(btn => {
                if (btn.id == posicionBot){
                    btn.textContent = p2.selectXOrO;
                    p2.boxClicked.push(btn.id);
                    btn.disabled = true;
                    p2.yourTurn = false;
                    p1.yourTurn = true;
                    checkWinner(p2);
                }
            })
        }
        else{
            botPlay();
        }
    }
}

// function that takes the 'positionsOnTheBoard' array and eliminates the unavailable positions and leaves the available ones for the bot movement.
function deleteUnavailableCell(array, valor){
    for(let i in array){
        if(array[i]==valor){
            array.splice(i, 1);
            console.log(array)
            break;
        }
    }
}

})();