let lastKey = "";

function extractLettersOnly(str) {
  return str.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function convertNumericKeyToLetters(key) {
  return key.replace(/[^0-9A-Za-z]/g, "").toUpperCase().replace(/[0-9]/g, digit => {
    return String.fromCharCode((parseInt(digit) % 26) + 65); // Map 0–9 to A–J
  });
}

function vigenere(text, key, mode) {
  const processedKey = convertNumericKeyToLetters(key);
  if (processedKey.length === 0) {
    return "❌ Error: Key must contain at least one letter or number.";
  }

  let result = "";
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (/[A-Za-z]/.test(char)) {
      const isUpper = char === char.toUpperCase();
      const base = isUpper ? 65 : 97;

      const textCharCode = char.charCodeAt(0) - base;
      const keyCharCode = processedKey.charCodeAt(keyIndex % processedKey.length) - 65;

      let newCharCode;
      if (mode === "encrypt") {
        newCharCode = (textCharCode + keyCharCode) % 26;
      } else {
        newCharCode = (textCharCode - keyCharCode + 26) % 26;
      }

      result += String.fromCharCode(newCharCode + base);
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

function encryptText() {
  const textInput = document.getElementById("textInput");
  const keyInput = document.getElementById("keyInput");
  const text = textInput.value.trim();
  const key = keyInput.value.trim();

  if (!text || !key) return alert("Please enter both text and key.");

  const result = vigenere(text, key, "encrypt");
  document.getElementById("resultOutput").value = result;

  // Clear input after encryption and move result to text input for reuse
  textInput.value = result;
  keyInput.value = "";

  // Store key for verification
  lastKey = key;
}

function decryptText() {
  const textInput = document.getElementById("textInput");
  const keyInput = document.getElementById("keyInput");
  const text = textInput.value.trim();
  const key = keyInput.value.trim();

  if (!text || !key) return alert("Please enter both text and key.");

  if (convertNumericKeyToLetters(key) !== convertNumericKeyToLetters(lastKey)) {
    return alert("❌ Incorrect key! Decryption failed.");
  }

  const result = vigenere(text, key, "decrypt");
  document.getElementById("resultOutput").value = result;
  textInput.value = result;
  keyInput.value = "";
}

function processFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Please select a file to load.");

  const reader = new FileReader();
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);

  reader.onload = function () {
    document.getElementById("textInput").value = reader.result;
    buttons.forEach(btn => btn.disabled = false);
    alert("✅ File loaded successfully. Now enter the key and click Encrypt or Decrypt.");
  };

  reader.onerror = function () {
    alert("❌ Failed to read file.");
    buttons.forEach(btn => btn.disabled = false);
  };

  reader.readAsText(file);
}

function downloadResult() {
  const text = document.getElementById("resultOutput").value.trim();
  if (!text) return alert("Nothing to download.");

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cipher_result.txt";
  link.click();
}
