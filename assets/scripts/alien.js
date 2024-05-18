// Alien Stuff
const humanText = ["Hello there!", "I'm E. T.", "Let's connect!"];
const symbols = "∩⌠≡±∟¤×Ø▬○⌡•⦿∘┴⍎⍝⍠ˡ～ˠ⥷⭄⥑⥐⥏⥎⥍⥰☌⇊⇇⇈⇉°✳✣";
const symbolsLength = symbols.length;
let isTranslated = false;

function createText() {
  const pars = [];
  humanText.forEach((text) => {
    pars.push(`<p>${text}</p>`);
  });

  speechContainer.innerHTML = pars.join("");
}

function makeTextAlien() {
  const pars = [];
  humanText.forEach((text) => {
    const l = text.length;
    let random_text = "";
    while (random_text.length < l) {
      random_text += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    pars.push(`<p>${random_text}</p>`);
  });

  speechContainer.innerHTML = pars.join("");
}

function translateText() {
  translateBtn.removeEventListener("click", translateText);

  const pars = speechContainer.querySelectorAll("p");
  const parsL = pars.length;
  for (let idx = 0; idx < parsL; idx++) {
    let fadeBuffer = [];
    let message = "";
    let completedLetters = 0;
    const lngth = humanText[idx].length;
    for (var i = 0; i < lngth; i++) {
      fadeBuffer.push({
        c: Math.floor(Math.random() * 18) + 1,
        l: humanText[idx].charAt(i),
      });
    }

    const intervalId = setInterval(() => {
      for (var i = 0; i < fadeBuffer.length; i++) {
        var fader = fadeBuffer[i];
        if (fader.c > 0) {
          do_cycles = true;
          fader.c--;
          message += symbols.charAt(Math.floor(Math.random() * symbols.length));
        } else {
          message += fader.l;
          completedLetters++;
        }
      }
      pars[idx].textContent = message;
      message = "";
      if (completedLetters >= fadeBuffer.length) {
        clearInterval(intervalId);
        translateBtn.addEventListener("click", translateText);
      } else {
        completedLetters = 0;
      }
    }, 100);
  }
}
createText();
makeTextAlien();
