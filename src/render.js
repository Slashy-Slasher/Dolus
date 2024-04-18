const inputDropdown = document.getElementById("inputDropdown");
const outputDropdown = document.getElementById("outputDropdown");
const enableBtn = document.getElementById("enableButton");

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
