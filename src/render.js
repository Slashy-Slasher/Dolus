const inputDropdown = document.getElementById("inputDropdown");
const outputDropdown = document.getElementById("outputDropdown");
const enableBtn = document.getElementById("enableButton");

const toggletheme = () => {
  const root = document.documentElement;
  const currentTheme = root.classList.contains('dark-theme') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  if (newTheme === 'dark') {
    root.style.setProperty('--backGround', '#141a21');
    root.style.setProperty('--container', '#fff');
    root.style.setProperty('--text', '#000');
    root.style.setProperty('--containerOffset', '#c7d5e0');
    root.classList.remove('light-theme')
    root.classList.add('dark-theme')
  } 
  
  else {
    root.style.setProperty('--backGround', '#fff');
    root.style.setProperty('--container', '#141a21');
    root.style.setProperty('--text', '#fff');
    root.style.setProperty('--containerOffset', '#171a21');
    root.classList.remove('dark-theme')
    root.classList.add('light-theme')
  }
};

function togglePasswordVisibility() {
  var passwordField = document.getElementById("encryptionKey");
  var toggleButton = document.querySelector(".toggle-password");

  if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleButton.textContent = "(O)";
  } else {
      passwordField.type = "password";
      toggleButton.textContent = "(X)";
  }
}

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
      option.value = source.deviceId;
      option.text = source.label || `Audio Input ${source.deviceId}`;
      inputDropdown.appendChild(option);
    });

    audioOutputs.map((source) => {
      const option = document.createElement("option");
      option.value = source.deviceId;
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
