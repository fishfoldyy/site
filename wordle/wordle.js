// misc

document.getElementById("home").addEventListener('click', function() {
  window.location.href = "/site/#stuff";
});

window.onclick = function(event) {
  if (event.target == document.getElementById('popup')) {
    document.getElementById('popup').style.display = 'none';
  }
}

var keys = document.querySelectorAll('.k');

keys.forEach(function(key) {
  key.addEventListener('click', function() {
    type(key.id);
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

// answer selection below

let answer = '';

async function fetchValidWords() {
  try {
    const response = await fetch('word-bank.txt');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    };
    const fileContent = await response.text();
    const words = fileContent.split(/\r?\n/);
    return words;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return [];
  };
};

function selectRandomWord(words) {
  const rnd = Math.floor(Math.random() * words.length);
  return words[rnd];
};

async function selectWord() {
  const validWords = await fetchValidWords();
  if (validWords.length > 0) {
    answer = selectRandomWord(validWords);
    // console.log(`Selected answer: ${answer}`) // For debugging
  }
}

selectWord();

// game end logic

document.querySelector('.close').onclick = function() {
  document.getElementById('popup').style.display = 'none';
}

document.getElementById("playagain").addEventListener('click', function() {
  location.reload();
});

// main code below

let winstatus = "";
let guess = 1;
let currentBox = 1;
let word = "";

document.getElementById("back").addEventListener('click', function() {
  backspace();
});

document.getElementById("enter").addEventListener('click', function() {
  enter();
});

function backspace() {
  if (currentBox != 1 && winstatus == '') {
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
  valid(word).then(isValid => {
    if (isValid) {
      winstatus = check(word, answer);      
      if (winstatus == 'win') {        
        document.getElementById("popuptxt").innerText = `you won with ${guess} guesses!`;
        document.getElementById("popup").style.display = "block";
      } else if (winstatus == 'lose') {
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
};

function type(key) {
  if (winstatus === "") {
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
    try {
      const response = await fetch('valid-wordle-guesses.txt');
      if (!response.ok) {
        throw new Error('response error');
      };
      const fileContent = await response.text();
      
      return fileContent.includes(u);
    } catch (error) {
      console.error('there\'s been an issue: ', error);
      return false;
    };
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
      document.getElementById(g[i].toUpperCase()).style.backgroundColor = "lightgreen";
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
          if (document.getElementById(g[i].toUpperCase()).style.backgroundColor !== "lightgreen") {
            document.getElementById(g[i].toUpperCase()).style.backgroundColor = "lightyellow";
          }
          guessMatched[i] = true;
          answerMatched[j] = true;
          break;
        }
      }
    }
  }

  // grey
  for (let i = 0; i < g.length; i++) {
    if (result[i] === '') {
      document.getElementById(guess.toString() + (i + 1).toString()).style.backgroundColor = "lightgrey";
      document.getElementById(g[i].toUpperCase()).style.backgroundColor = "lightgrey";
    }
  }

  if (guess == 6) {
    return 'lose';
  } else {
    return '';
  }
}
