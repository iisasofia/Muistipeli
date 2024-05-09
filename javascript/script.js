// Aloita
document.querySelector(".control-buttons span").onclick = function () {
  
  let yourName = prompt("Mikä on sinun nimesi?");
  // tyhjä nimi
  if (yourName == null || yourName == "") {
    document.querySelector(".name span").innerHTML = "Nimetön";
  } else {
    // on nimi
    document.querySelector(".name span").innerHTML = yourName;
  }
  
  document.querySelector(".control-buttons").remove();
  interval = setInterval(displayTimer, 10);
};

let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");

let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];

shuffle(orderRange);

blocks.forEach((block, index) => {
  block.style.order = orderRange[index];

  
  block.addEventListener("click", function () {
    flipBlock(block);
  });
});

function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");

  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );
 
  if (allFlippedBlocks.length == 2) {
       stopClicking();

    checkedMatchedBlock(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
  festival();
}

function stopClicking() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

function checkedMatchedBlock(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");

if (firstBlock.dataset.kuvaData === secondBlock.dataset.kuvaData) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    document.getElementById("success").play();
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
    document.getElementById("fail").play();
  }
}

function shuffle(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;

    temp = array[current];

    array[current] = array[random];

    array[random] = temp;
  }
  return array;
}

document.getElementById("another-game-btn").onclick = () => {
  location.reload();
};

function festival() {
  let hasMatchs = blocks.filter((hasMatch) =>
    hasMatch.classList.contains("has-match")
  );
  if (hasMatchs.length === blocks.length) {
    clearInterval(interval);
    newPlayer();
    showPlayer();
    document.getElementById(
      "Aikasi"
    ).innerHTML = `Sinun aikasi: ${timer.innerHTML}`;
    setTimeout(() => {
      document.querySelector(".win-screen").style.display = "block";
      document.getElementById("win").play();

      document.getElementById("another-game-btn").style.display = "block";

      document.getElementById("my-canvas").style.display = "block";

      let confettiSettings = { target: "my-canvas" };
      let confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
    }, duration);
  }
}

let [milliseconds, seconds, minutes] = [0, 0, 0];
let timer = document.querySelector(".stopwatch");
let interval = null;

function displayTimer() {
  milliseconds += 10;

  if (milliseconds == 1000) {
    milliseconds = 0;
    seconds++;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
  }

  let m = minutes < 10 ? `0${minutes}` : minutes;
  let s = seconds < 10 ? `0${seconds}` : seconds;
  let ms =
    milliseconds < 10
      ? `00${milliseconds}`
      : milliseconds < 100
      ? `0${milliseconds}`
      : milliseconds;

  timer.innerHTML = `${m}:${s}:${ms}`;
}

let results = [];

if (localStorage.games != null) {
  results = JSON.parse(localStorage.games);
} else {
  results = [];
}

async function newPlayer() {
  let newPlayer = {
    playerName: document.querySelector(".name span").innerHTML.toLowerCase(),
    playerTime: timer.innerHTML,
    playerWrongTries: document.querySelector(".tries span").innerHTML,
  };

  let result = await results.find(
    (result) => result.playerName === newPlayer.playerName
  );

  if (result) {
    if (+result.playerWrongTries > +newPlayer.playerWrongTries) {
      result.playerWrongTries = newPlayer.playerWrongTries;
      result.playerTime = newPlayer.playerTime;
      document.querySelector("#win-screen div").innerHTML =
        "Voitit ja teit uuden ennätyksen!:)";
      document
        .querySelector("#win-screen div")
        .classList.add("personal-best-msg");
    } else {
      return false;
    }
  } else {
    results.push(newPlayer);
  }

  window.localStorage.setItem("games", JSON.stringify(results));
  showPlayer();
}

function showPlayer() {
  let playerTable = "";

  results.sort((a, b) => a.playerWrongTries - b.playerWrongTries);

  for (let i = 0; i < results.length; i++) {
    playerTable += `
      <tr>
        <td id="rank">${i + 1}</td>
        <td id="playar-name">${results[i].playerName}</td>
        <td id="player-time">${results[i].playerTime}</td>
        <td id="player-wrong-tries">${results[i].playerWrongTries}</td>
      </tr>
    `;
  }
  document.getElementById("player-table-body").innerHTML = playerTable;
}
showPlayer();
