
var errors = 0;
var cardList1 = [
    "1 (1)", "1 (2)", "1 (3)", "1 (4)", "1 (5)", "1 (6)", "1 (7)", "1 (8)", "1 (9)", "1 (10)", "1 (11)", "1 (12)", "1 (13)", "1 (14)", "1 (15)", "1 (16)", "1 (17)", "1 (18)", "1 (19)", "1 (20)", "1 (21)", "1 (22)", "1 (23)", "1 (24)", "1 (25)", "1 (26)", "1 (27)", "1 (28)", "1 (29)", "1 (30)", "1 (31)", "1 (32)", "1 (33)", "1 (34)", "1 (35)", "1 (36)", "1 (37)", "1 (38)", "1 (39)", "1 (40)", "1 (41)", "1 (42)"

];

// Function to randomly select n elements from an array
const getRandomElements = function(arr,n) {
    let randomElem = [];
    let length = arr.length;
    for(let i = 0; i < n; i++) {
        let curSize = randomElem.length;
        while(randomElem.length === curSize) {
            let randomIndex = Math.floor(length*Math.random());
            if(randomElem.indexOf(arr[randomIndex]) === -1) {
                randomElem.push(arr[randomIndex]);
            }
        }
    }
    return randomElem;
}

var cardList = getRandomElements(cardList1, 4);

var cardSet;
var board = [];
var rows = 4;
var columns =2;

var card1Selected;
var card2Selected;

window.onload = function() {
    shuffleCards();
    startGame();
}

function shuffleCards() {
    cardSet = cardList.concat(cardList); //two of each card
    //shuffle
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length); //get random index
        //swap
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

function startGame() {
   
    let imagesLoaded = 0; // Counter to track loaded images
    let totalImages = rows * columns; // Total number of images to load

    // Arrange the board 4x2
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg); // JS

            // Create a container for the card with fixed width and height
            let cardContainer = document.createElement("div");
            cardContainer.classList.add("card-container");

            // Create the card element
            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = cardImg + ".jpg";
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            
            // Increment the counter when the image is loaded
            card.onload = function() {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    setTimeout(hideCards, 5000);
                }
            };

            // Append the card to the container
            cardContainer.appendChild(card);

            // Append the container to the board
            document.getElementById("board").appendChild(cardContainer);
        }
        board.push(row);
    }

    console.log(board);
}

function hideCards() {
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            card.src = "back.jpg";
        }
    }
}

function selectCard() {
    
    if (this.src.includes("back")) {
        if (!card1Selected) {
            card1Selected = this;

            let coords = card1Selected.id.split("-"); //"0-1" -> ["0", "1"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card1Selected.src = board[r][c] + ".jpg";
        }
        else if (!card2Selected && this != card1Selected) {
            card2Selected = this;

            let coords = card2Selected.id.split("-"); //"0-1" -> ["0", "1"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card2Selected.src = board[r][c] + ".jpg";
            setTimeout(update, 500);
        }
    }

}

var pairsFound = 0;
var totalPairs = rows * columns / 2; // Total number of pairs

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

function update() {
    // If cards aren't the same, flip both back
    if (card1Selected.src !== card2Selected.src) {
        card1Selected.src = "back.jpg";
        card2Selected.src = "back.jpg";
        errors += 1;
        document.getElementById("errors").innerText = "Error: " + errors; // Concatenate "Error: " with the error count
        document.getElementById("errors").innerText = "Error: " + errors; // Concatenate "Error: " with the error count
        document.getElementById("buzzer-sound").play();
    }
     else {
        // Cards are the same, so remove them from the board
        card1Selected.style.display = "none";
        card2Selected.style.display = "none";
        pairsFound++;
        document.getElementById("bell-sound").play(); // Play bell sound
        if (pairsFound === totalPairs) {
            setTimeout(function() {
                document.getElementById("win-sound").play(); // Play win sound after 1 second delay
            }, 1000); // Delay of 1000 milliseconds (1 second)
            setTimeout(function() {
                resetGame();
            }, 4000); // Reset the game after 4 seconds (including the 1-second delay)
            return;
        }        
    }

    card1Selected = null;
    card2Selected = null;
}

function resetGame() {
    // Clear the board
    document.getElementById("board").innerHTML = "";
    // Reset variables
    card1Selected = null;
    card2Selected = null;
    pairsFound = 0;
    errors = 0;
    document.getElementById("errors").innerText = "Error: " + errors; 
    // Shuffle and start a new game
    location.reload(); // Reload the page
}
