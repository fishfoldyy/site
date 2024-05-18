// Initialize global variables
let gameStatus = '';
let guess = 1;
let currentBox = 1;
let word = '';
let answer = '';
let validWords = [];
let validGuesses = [];

// Event listeners
document.getElementById("home").addEventListener('click', function() {
  window.location.href = "/#stuff";
});

window.onclick = function(event) {
  if (event.target == document.getElementById('popup')) {
      document.getElementById('popup').style.display = 'none';
  }
}

document.getElementById("back").addEventListener('click', function() {
  if (gameStatus == '') {
    backspace();
  }
});

document.getElementById("enter").addEventListener('click', function() {
  if (gameStatus == '') {
    enter();
  }
});

var keys = document.querySelectorAll('.k');

keys.forEach(function(key) {
  key.addEventListener('click', function() {
    if (gameStatus == '') {
      type(key.id);
    };
  });
});

document.addEventListener("keyup", (e) => {
  let kPress = String(e.key);
  if (kPress === "Backspace") {
    backspace();
    return;
  };

  if (kPress === "Enter") {
    enter();
    return;
  };

  let found = kPress.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    type(kPress.toUpperCase());
  };
});

function stopInteraction() {
  gameStatus = 'pause';
}

function startInteraction() {
  gameStatus = '';
}

// Fetch word lists
async function fetchWordLists() {
  try {
    const [wordResponse, validGuessResponse] = await Promise.all([
      fetch('word-bank.txt'),
      fetch('valid-wordle-guesses.txt')
    ]);

    if (!wordResponse.ok || !validGuessResponse.ok) {
      throw new Error('Network response was not ok');
    };

    const [wordText, validGuessText] = await Promise.all([
      wordResponse.text(),
      validGuessResponse.text()
    ]);

    validWords = wordText.split(/\r?\n/);
    validGuesses = validGuessText.split(/\r?\n/);

    selectWord();
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  };
}

fetchWordLists();

// Answer selection
function selectRandomWord(words) {
  const rnd = Math.floor(Math.random() * words.length);
  return words[rnd];
};

function selectWord() {
  if (validWords.length > 0) {
    answer = selectRandomWord(validWords);
    // console.log(`Selected answer: ${answer}`) // For debugging
  }
}

// Game end logic
document.querySelector('.close').onclick = function() {
  document.getElementById('popup').style.display = 'none';
}

document.getElementById("playagain").addEventListener('click', function() {
  location.reload();
});

// Main code
function backspace() {
  if (currentBox != 1 && gameStatus == '') {
    currentBox--;
    document.getElementById(guess.toString() + currentBox.toString()).innerText = "";
    word = word.slice(0, -1);
  };
};

function enter() {
  word = "";
  for (let i = 1; i <= 5; i++) {
    word += document.getElementById(guess.toString() + i.toString()).innerText.toLowerCase();
  };
  stopInteraction();
  valid(word).then(isValid => {
    if (isValid) {
      gameStatus = check(word, answer);      
      if (gameStatus == 'win') {        
        document.getElementById("popuptxt").innerText = `you won with ${guess} guesses!`;
        document.getElementById("popup").style.display = "block";
      } else if (gameStatus == 'lose') {
        document.getElementById("popuptxt").innerText = `you lost. the word was "${answer}".`;
        document.getElementById("popup").style.display = "block";
      } else {
        guess++;
        word = "";
        currentBox = 1;
      }
    } else {
      console.log("invalid word");
    };
  });
  startInteraction();
};

function type(key) {
  if (gameStatus === "") {
    if (currentBox == 6) {
      return;
    } else {
      document.getElementById(guess.toString() + currentBox.toString()).innerText = key;
      currentBox++;
    };
  };
};

async function valid(u) {
  if (u.length !== 5) {
    return false;
  } else {
    return validGuesses.includes(u);
  };
};

function check(g, answer) {
  let result = Array(g.length).fill(''); // Initialize result array
  let guessMatched = Array(g.length).fill(false); // Track matched positions in guess
  let answerMatched = Array(answer.length).fill(false); // Track matched positions in answer

  if (g === answer) { // win!
    for (let i = 0; i < 5; i++) {
      document.getElementById(guess.toString() + (i + 1).toString()).style.backgroundColor = "lightgreen";
    }
    return 'win';
  }

  // green
  for (let i = 0; i < g.length; i++) {
    if (g[i] === answer[i]) {
      result[i] = 'G'; // mark g
      document.getElementById(guess.toString() + (i + 1).toString()).style.backgroundColor = "lightgreen";
      updateKeyColor(g[i], 'lightgreen');
      guessMatched[i] = true;
      answerMatched[i] = true;
    }
  }

  // yellow
  for (let i = 0; i < g.length; i++) {
    if (result[i] === '') { // check only those not already marked
      for (let j = 0; j < answer.length; j++) {
        if (!answerMatched[j] && g[i] === answer[j]) {
          result[i] = 'Y'; // mark y
          document.getElementById(guess.toString() + (i + 1).toString()).style.backgroundColor = "lightyellow";
          updateKeyColor(g[i], 'lightyellow');
          guessMatched[i] = true;
          answerMatched[j] = true;
          break;
        }
      }
    }
  }

  // grey
  for (let i = 0; i < g.length; i++) {
    if (result[i] == '') {
      document.getElementById(guess.toString() + (i + 1).toString()).style.backgroundColor = "lightgrey";
      updateKeyColor(g[i], 'lightgrey');
    }
  }

  if (guess == 6) {
    return 'lose';
  } else {
    return '';
  }
}

function updateKeyColor(letter, color) {
  let key = document.getElementById(letter.toUpperCase());
  if (color === 'lightgreen' || key.style.backgroundColor === '' || key.style.backgroundColor === 'lightgrey') {
    key.style.backgroundColor = color;
  }
}
