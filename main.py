import sounddevice as sd
import numpy as np # Make sure NumPy is loaded before it is used in the callback

def select_input(device):
    devices = sd.query_devices()
    input_device = None
    for i, dev in enumerate(devices):
        if dev["name"] == device:
            input_device = i
            break
    return input_device

def select_output(device):
    devices = sd.query_devices()
    output_device = None
    for i, dev in enumerate(devices):
        if dev["name"] == device:
            output_device = i
            break
    return output_device

# This method is dependent on owning Virtual Audio Cable (VAC)
def get_virtual_input():
    devices = sd.query_devices()
    virtual_input = None
    for i, dev in enumerate(devices):
        if dev["name"] == "Line 1 (Virtual Audio Cable)":
            virtual_input = i
            break
    return virtual_input

# This method is dependent on owning VB-Audio Virtual Cable 
def get_virtual_output():
    devices = sd.query_devices()
    virtual_output = None
    for i, dev in enumerate(devices):
        if dev["name"] == "CABLE Input (VB-Audio Virtual C":
            virtual_output = i
            break
    return virtual_output

virtual_input, virtual_output = get_virtual_input(), get_virtual_output()
input_device = select_input('Microphone (HyperX Cloud Alpha ') # This will link to front-end
output_device = select_output('Headset Earphone (HyperX Cloud ') # This will link to front-end

virtual_stream = sd.Stream(device=(virtual_input, virtual_output), channels=2, samplerate=44100)
physical_stream = sd.Stream(device=(input_device, output_device), channels=2, samplerate=44100)

virtual_stream.start()
physical_stream.start()

def read_write_devices():
    while True:
        data_physical, _ = physical_stream.read(1024)
        data_virtual, _ = virtual_stream.read(1024)
        
        physical_stream.write(data_virtual)
        virtual_stream.write(data_physical)

read_write_devices()