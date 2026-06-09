let bgMusic;
let musicButton;
let musicOn = false;

window.addEventListener("load", function () {
  // create audio
  bgMusic = document.createElement("audio");
  bgMusic.src = "Assets/music/headOverHeels.mp3"; // change this path if needed
  bgMusic.loop = true;
  bgMusic.volume = 0.35;
  document.body.appendChild(bgMusic);

  // create button
  musicButton = document.createElement("button");
  musicButton.id = "musicButton";
  musicButton.classList.add("music-btn");

  let topnav = document.querySelector(".topnav");

  if (topnav) {
    topnav.appendChild(musicButton);
  }
  else {
    document.body.appendChild(musicButton);
  }

  // get saved music settings
  musicOn = localStorage.getItem("musicOn") === "true";

  let savedTime = parseFloat(localStorage.getItem("musicTime")) || 0;
  bgMusic.currentTime = savedTime;

  updateMusicButton();

  musicButton.onclick = function () {
    toggleMusic();
  };

  // try to continue music if it was on before
  if (musicOn) {
    bgMusic.play().catch(function () {
      // browser blocked autoplay, user must click button again
      musicOn = false;
      localStorage.setItem("musicOn", "false");
      updateMusicButton();
    });
  }
});

function toggleMusic() {
  if (musicOn) {
    bgMusic.pause();
    musicOn = false;
    localStorage.setItem("musicOn", "false");
  }
  else {
    bgMusic.play();
    musicOn = true;
    localStorage.setItem("musicOn", "true");
  }

  updateMusicButton();
}


function updateMusicButton() {
  if (musicButton) {
    if (musicOn) {
      musicButton.innerHTML = "🔊";
      musicButton.title = "Music on";
      musicButton.classList.add("music-on");
    }
    else {
      musicButton.innerHTML = "🔇";
      musicButton.title = "Music off";
      musicButton.classList.remove("music-on");
    }
  }
}

// save song time before switching pages
window.addEventListener("beforeunload", function () {
  if (bgMusic) {
    localStorage.setItem("musicTime", bgMusic.currentTime);
  }
});