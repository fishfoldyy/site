const buttons = document.querySelectorAll('.mode');

document.getElementById("home").addEventListener('click', function() {
    window.location.href = "/site/#stuff";
});

let mode = 10;
document.getElementById("ten").style.backgroundColor = "#324ac3";
document.getElementById("ten").style.color = "white";
document.getElementById("ten").style.border = "none";

let playing = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => {
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.border = '';
        });
        button.style.backgroundColor = '#324ac3';
        button.style.color = 'white';
        button.style.border = 'none';
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

document.getElementById("one").addEventListener('click', function() {
    mode = 1;
    document.getElementById("clicky").innerText = mode + " second test";
});
document.getElementById("five").addEventListener('click', function() {
    mode = 5;
    document.getElementById("clicky").innerText = mode + " second test";
});
document.getElementById("ten").addEventListener('click', function() {
    mode = 10;
    document.getElementById("clicky").innerText = mode + " second test";
});
document.getElementById("thirty").addEventListener('click', function() {
    mode = 30;
    document.getElementById("clicky").innerText = mode + " second test";
});

document.getElementById("clicky").innerText = mode + " second test";

function text(x) {
    if (x >= 16) {
        return "u hacking?";
    }
    if (x >= 14) {
        return "whoa";
    }
    if (x >= 12) {
        return "very fast";
    }
    if (x >= 10) {
        return "pretty fast";
    }
    if (x >= 8) {
        return "close enough";
    }
    if (x >= 6) {
        return "sure";
    }
    if (x >= 5) {
        return "ehh";
    }
    if (x >= 3) {
        return "are you even trying";
    }
    if (x >= 1) {
        return "how?";
    }
    else {
        return "bro";
    }
}

async function cpstest(v) {
    playing = true;
    document.getElementById("one").disabled = true;
    document.getElementById("five").disabled = true;
    document.getElementById("ten").disabled = true;
    document.getElementById("thirty").disabled = true;
    
    let score = 1;
    let time = v;
    let timeLeft = time;
    let timerInterval;
    
    document.getElementById("timer").innerText = `${timeLeft} seconds`;

    
    document.getElementById("clicky").addEventListener("click", () => {
        if (playing == true) {
            score++;
            document.getElementById("score").innerText = `Score: ${score}`;
        };
    });
    
    timerInterval = setInterval(async () => {
        timeLeft = Math.round((timeLeft - 0.1) * 10) /10;
        if (timeLeft >= 0) {
            document.getElementById("timer").innerText = `${timeLeft} seconds`;
        }
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            document.getElementById("timer").innerText = `your CPS was ${Math.round((score/time) * 100) / 100}` + ' (' + text(score/time) + ')';

            document.getElementById("clicky").innerText = "try again";
            document.getElementById("clicky").disabled = true;
            
            document.getElementById("one").disabled = false;
            document.getElementById("five").disabled = false;
            document.getElementById("ten").disabled = false;
            document.getElementById("thirty").disabled = false;
            
            await sleep(2500);
            document.getElementById("clicky").disabled = false;
            playing = false;
        }
    }, 98);
}

document.getElementById("clicky").addEventListener("click", function() {
    if (playing == false) {
        document.getElementById("clicky").innerText = "click me";
        document.getElementById("score").innerText = "Score: 1";
        cpstest(mode);
    };
})
