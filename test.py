import sys
import json
import struct
import subprocess


def getMessage():
    rawLength = sys.stdin.buffer.read(4)
    messageLength = struct.unpack("@I", rawLength)[0]
    message = sys.stdin.buffer.read(messageLength).decode("utf-8")
    return json.loads(message)


def encodeMessage(messageContent):
    encodedContent = json.dumps(messageContent).encode("utf-8")
    encodedLength = struct.pack("@I", len(encodedContent))

    return {"length": encodedLength, "content": encodedContent}


def sendMessage(encodedMessage):
    sys.stdout.buffer.write(encodedMessage['length'])
    sys.stdout.buffer.write(encodedMessage['content'])
    sys.stdout.buffer.flush()


while True:
    host = getMessage()
    #run_args = ["cmd", "/c", "ping_batch.bat", host]  # Show cmd.
    #run_args = ["ping", host] # Do not use cmd.
    #res = subprocess.run(run_args, stdout=subprocess.PIPE)
    #sendMessage(encodeMessage(str(res.returncode)))
    sendMessage(encodeMessage(str(host)))
