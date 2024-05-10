/*voittoikkuna*/
function showVictoryScreen() {
    let hasMatches = blocks.filter((hasMatch) =>
      hasMatch.classList.contains("has-match")
    );
    if (hasMatches.length === blocks.length) {
      clearInterval(interval);
      newPlayer();
      showPlayer();
      document.getElementById(
        "your-time"
      ).innerHTML = `Your Time: ${timer.innerHTML}`;
      setTimeout(() => {
        document.querySelector(".win-screen").style.display = "block";
        document.getElementById("win").play();
  
        document.getElementById("another-game-btn").style.display = "block";
      }, duration);
    }
  }
  
