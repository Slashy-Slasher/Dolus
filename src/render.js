const inputDropdown = document.getElementById("inputDropdown");
const outputDropdown = document.getElementById("outputDropdown");
const enableBtn = document.getElementById("enableButton");
const keyValue = document.getElementById("encryptionKey");
enabled = false;

let dolusProcess = null;

function activateDolus() {
  let args = [keyValue.value, inputDropdown.value, outputDropdown.value];
  console.log(args);
  dolusProcess = require("child_process").spawn("py", ["./main.py", ...args]);
  dolusProcess.stdout.on("data", function (data) {
    console.log("data: ", data.toString("utf8"));
  });
  dolusProcess.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`); // when error
  });
}

// Function to flip the theme of the application
const toggletheme = () => {
  const root = document.documentElement;
  const currentTheme = root.classList.contains("dark-theme") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  if (newTheme === "dark") {
    root.style.setProperty("--backGround", "#141a21");
    root.style.setProperty("--container", "#fff");
    root.style.setProperty("--text", "#000");
    root.style.setProperty("--containerOffset", "#c7d5e0");
    root.classList.remove("light-theme");
    root.classList.add("dark-theme");
  } else {
    root.style.setProperty("--backGround", "#fff");
    root.style.setProperty("--container", "#141a21");
    root.style.setProperty("--text", "#fff");
    root.style.setProperty("--containerOffset", "#171a21");
    root.classList.remove("dark-theme");
    root.classList.add("light-theme");
  }
};

// Function to toggle password visibility
function togglePasswordVisibility() {
  var passwordField = document.getElementById("encryptionKey");
  var toggleButton = document.querySelector(".toggle-password");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleButton.textContent = "Hide";
  } else {
    passwordField.type = "password";
    toggleButton.textContent = "Show";
  }
}

// Function to enable or disable the audio modification
function enableOrDisable() {
  const selectedInputDevice = inputDropdown.value;
  const selectedOutputDevice = outputDropdown.value;

  // False - Denotes that the audio modification is not currently enabled
  // True - Denotes that the audio modification is currently enabled

  // If the Chunk Size is not provided, then set it to 12000
  if (document.getElementById("encryptionKey").value === "") {
    document.getElementById("encryptionKey").value = "12000";
  }

  // 
  if (enabled === true) {
    enableBtn.textContent = "Enable";
    document.getElementById("encryptionKey").disabled = false;

    // Reset the borders to the CSS --background color
    document.getElementById("encryptionKey").style.borderColor =
      "var(--background)";
    enabled = false;

    if (dolusProcess) {
      dolusProcess.kill();
      dolusProcess = null;
    }

  } else {
    enableBtn.textContent = "Disable";
    document.getElementById("encryptionKey").disabled = true;

    document.getElementById("encryptionKey").style.borderColor = "red";
    enabled = true;
    activateDolus();
  }
}

// TBI - Function to generate a random key
function generateKey() {
  var key = Math.random().toString(36).slice(-8);
  document.getElementById("encryptionKey").value = key;
}

// Function to get the audio sources
async function getAudioSources() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = [];
    const audioOutputs = [];

    devices.forEach((device) => {
      if (device.kind === "audioinput") {
        audioInputs.push(device);
      } else if (device.kind === "audiooutput") {
        audioOutputs.push(device);
      }
    });

    inputDropdown.innerHTML = "";
    outputDropdown.innerHTML = "";

    audioInputs.map((source) => {
      const option = document.createElement("option");
      option.value = source.label;
      option.text = source.label || `Audio Input ${source.deviceId}`;
      inputDropdown.appendChild(option);
    });

    audioOutputs.map((source) => {
      const option = document.createElement("option");
      option.value = source.label;
      option.text = source.label || `Audio Output ${source.deviceId}`;
      outputDropdown.appendChild(option);
    });
  } catch (err) {
    console.log(err.name + ": " + err.message);
  }
}

window.onload = function () {
  getAudioSources();
};

navigator.mediaDevices.ondevicechange = async (event) => {
  await getAudioSources();
};

inputDropdown.onchange = function () {
  const selectedInputDevice = inputDropdown.value;
  console.log(`Selected audio input device: ${selectedInputDevice}`);
};

outputDropdown.onchange = function () {
  const selectedOutputDevice = outputDropdown.value;
  console.log(`Selected audio output device: ${selectedOutputDevice}`);
};
