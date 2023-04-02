import correctSound from "../sound/correct-answer-notification.wav";
import incorrectSound from "../sound/incorrect-sound.wav";
import alertSound from "../sound/correct-positive-answer.wav";

export function copyTextToClipboard(
  text = "Please provide text to copy to clipboard!"
) {
  navigator.clipboard.writeText(text);
  console.log(`Text copied!`);
}

export function selectAndFocus(elementId) {
  document.getElementById(elementId).select();
  document.getElementById(elementId).focus();
}

export function getScanText(text = "Pleasae provide text as string type") {
  let newText = text.trim();
  if (newText.indexOf(" ") > 0) {
    newText = newText.slice(0, newText.indexOf(" "));
  }
  // console.log(newText)
  return newText;
}

export function logout() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const defaultStation = localStorage.getItem("defaultStation");

  if (token) {
    localStorage.removeItem("token");
  }
  if (defaultStation) {
    localStorage.removeItem("defaultStation");
  }
  if (user) {
    localStorage.removeItem("user");
  }
  window.location = "/login";
}

export function playCorrectSound() {
  var audio = new Audio(correctSound);
  audio.play();
}

export function playIncorrectSound() {
  var audio = new Audio(incorrectSound);
  audio.play();
}

export function playAlertSound() {
  var audio = new Audio(alertSound);
  audio.play();
}
