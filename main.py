import sys
import sounddevice as sd
import numpy as np
import difflib

def select_input(device):
    devices = sd.query_devices()
    matches = []
    for i, dev in enumerate(devices):
        if dev["hostapi"] == api_index:
            match_ratio = difflib.SequenceMatcher(None, device, dev["name"]).ratio()
            if match_ratio > 0.5:
                matches.append((match_ratio, i))
    if matches:
        best_match = max(matches, key=lambda x: x[0])[1]
        return best_match
    return None

def select_output(device):
    devices = sd.query_devices()
    matches = []
    for i, dev in enumerate(devices):
        if dev["hostapi"] == api_index:
            match_ratio = difflib.SequenceMatcher(None, device, dev["name"]).ratio()
            if match_ratio > 0.5:
                matches.append((match_ratio, i))
    if matches:
        best_match = max(matches, key=lambda x: x[0])[1]
        return best_match
    return None

def get_virtual_input():
    devices = sd.query_devices()
    virtual_input = None
    for i, dev in enumerate(devices):
        if dev["hostapi"] == api_index:
            if dev["name"] == "Line 1 (Virtual Audio Cable)":
                virtual_input = i
                break
    return virtual_input

def get_virtual_output():
    devices = sd.query_devices()
    virtual_output = None
    for i, dev in enumerate(devices):
        if dev["hostapi"] == api_index:
            if dev["name"] == "CABLE Input (VB-Audio Virtual C":
                virtual_output = i
                break
    return virtual_output

def flip_data(array):
    flipped_array = np.flip(array)
    return flipped_array

def read_write_devices(input_device, output_device, virtual_input, virtual_output):
    input_stream = sd.Stream(device=(input_device, virtual_output), channels=CHANNELS, blocksize=CHUNK)
    output_stream = sd.Stream(device=(virtual_input, output_device), channels=CHANNELS, blocksize=CHUNK)

    input_stream.start()
    output_stream.start()
    while True:
        indata, _ = input_stream.read(CHUNK)
        indata = flip_data(indata)
        indata = np.ascontiguousarray(indata)
        input_stream.write(indata)

        outdata, _ = output_stream.read(CHUNK)
        outdata = flip_data(outdata)
        outdata = np.ascontiguousarray(outdata)
        output_stream.write(outdata)

if __name__ == "__main__":
    CHUNK = int(sys.argv[1])
    CHANNELS = 2

    apis = sd.query_hostapis()
    api_index = 0

    for i, api in enumerate(apis):
        if api["name"] == "MME":
            api_index = i
            break

    virtual_input, virtual_output = get_virtual_input(), get_virtual_output()
    input_device = select_input(sys.argv[2])
    output_device = select_output(sys.argv[3])

    if input_device is None or output_device is None or virtual_input is None or virtual_output is None:
        print("Error: One or more devices not found.")
        sys.exit(1)

    print("Input device:", input_device)
    print("Output device:", output_device)
    print("Virtual Input:", virtual_input)
    print("Virtual Output:", virtual_output)

    sys.stdout.flush()

    read_write_devices(input_device, output_device, virtual_input, virtual_output)