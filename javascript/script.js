/*peli alkaa*/
document.querySelector(".control-buttons span").onclick = function () {
    let yourName = prompt("Lisää nimi:");
    if (yourName == null || yourName == "") {
      document.querySelector(".name span").innerHTML = "Anonyymi";
    } else {
      document.querySelector(".name span").innerHTML = yourName;
    }
    document.querySelector(".control-buttons").remove();
    interval = setInterval(displayTimer, 10);
  };
  
  /*peli*/
  let duration = 1000;
  let blocksContainer = document.querySelector(".kortit");
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
  
      checkMatchedBlock(allFlippedBlocks[0], allFlippedBlocks[1]);
    }
    checkGameCompletion();
  }
  
  function stopClicking() {
    blocksContainer.classList.add("no-clicking");
  
    setTimeout(() => {
      blocksContainer.classList.remove("no-clicking");
    }, duration);
  }
  
  function checkMatchedBlock(firstBlock, secondBlock) {
    let triesElement = document.querySelector(".tries span");
  
    if (firstBlock.dataset.emoji === secondBlock.dataset.emoji) {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
  
      firstBlock.classList.add("has-match");
      secondBlock.classList.add("has-match");
  

    } else {
      triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
  
      setTimeout(() => {
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");
      }, duration);

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
  
  function checkGameCompletion() {
    let hasMatches = blocks.filter((block) => block.classList.contains("has-match"));
    if (hasMatches.length === blocks.length) {
      clearInterval(interval);
      newPlayer();
      showPlayer();
      document.getElementById("your-time").innerHTML = `Aikasi: ${timer.innerHTML}`;
      setTimeout(() => {
        document.querySelector(".win-screen").style.display = "block";
        document.getElementById("another-game-btn").style.display = "block";
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
          "Uusi ennätyksesi";
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
  
    /*leaderboardi*/
    results.sort((a, b) => a.playerWrongTries - b.playerWrongTries);
  
    for (let i = 0; i < results.length; i++) {
      playerTable += `
        <tr>
          <td id="rank">${i + 1}</td>
          <td id="player-name">${results[i].playerName}</td>
          <td id="player-time">${results[i].playerTime}</td>
          <td id="player-wrong-tries">${results[i].playerWrongTries}</td>
        </tr>
      `;
    }
    document.getElementById("player-table-body").innerHTML = playerTable;
  }
  showPlayer();
  
