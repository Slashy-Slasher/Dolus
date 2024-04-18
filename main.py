import os

import numpy
import pyaudio
import numpy as np

from crypto.Random import get_random_bytes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


CHUNK = 1024
RATE = 44100
LEN = 10

# Encryption key
encryption_key = os.urandom(16)

def encrypt_data(data, encryption_key):
    backend = default_backend()
    iv = get_random_bytes(16)  # Generate a random IV (Initialization Vector)
    cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(iv), backend=backend)
    encryptor = cipher.encryptor()
    ct = encryptor.update(data) + encryptor.finalize()
    return iv + ct

def decrypt_data(data, encryption_key):
    iv = data[:16]  # Extract the IV from the encrypted data
    data = data[16:]  # Remove the IV from the encrypted data
    backend = default_backend()
    cipher = Cipher(algorithms.AES(encryption_key), modes.CBC(iv), backend=backend)
    decryptor = cipher.decryptor()
    pt = decryptor.update(data) + decryptor.finalize()
    return pt

#Finds the average volume of the data.
def average_of_data(data):
    if(np.mean(data) >= 2):
        return True
    return False

# PyAudio setup
p = pyaudio.PyAudio()
p2 = pyaudio.PyAudio()

devices = p.get_device_count()

#Printing available audio devices
for i in range(p.get_device_count()):
    print(p.get_device_info_by_index(i))

index1 = 1  # Selected Microphone
index2 = 13 # VB Audio Cable "Input"
index3 = 10  # Selected Speaker
index4 = 6  # VB Audio Cable "Output"

print()
print(p.get_device_info_by_index(index1))
print(p.get_device_info_by_index(index2))
print()
print(p.get_device_info_by_index(index3))
print(p.get_device_info_by_index(index4))

# Stream setup
stream = p.open(
    format=pyaudio.paInt16, channels=1, rate=RATE, input=True, frames_per_buffer=CHUNK, input_device_index=index1
)

player = p.open(
    format=pyaudio.paInt16, channels=1, rate=RATE, output=True, frames_per_buffer=CHUNK, output_device_index=index2
)

player2 = p2.open(
    format=pyaudio.paInt16, channels=1, rate=RATE, output=True, frames_per_buffer=CHUNK, input_device_index=index3
)
stream2 = p2.open(
    format=pyaudio.paInt16, channels=1, rate=RATE, input=True, frames_per_buffer=CHUNK, input_device_index=index4
)

# Main loop
try:
    while True:
        # Read data from input streams
        data = np.frombuffer(stream.read(CHUNK),  dtype=np.int16)
        data2= np.frombuffer(stream2.read(CHUNK), dtype=np.int16)

        print(f'Data 1: {data} Avg: {numpy.mean(data)}')
        print(f'Data 2: {data2} Avg: {numpy.mean(data2)}')
        print()

        #encrypted_data = encrypt_data(data.tobytes(), encryption_key)
        #player.write(bytes(encrypted_data), CHUNK)
        player.write(bytes(data), CHUNK)

        # Check if data is received before decryption
        #if average_of_data(data2):
        #decrypted_data = decrypt_data(data2.tobytes(), encryption_key)
        #player2.write(bytes(decrypted_data), CHUNK)
        player2.write(bytes(data2), CHUNK)



except KeyboardInterrupt:
    print("Exiting...")
    # Cleanup
    stream.stop_stream()
    stream.close()
    stream2.stop_stream()
    stream2.close()

    player.stop_stream()
    player.close()
    player2.stop_stream()
    player2.close()
    p.terminate()