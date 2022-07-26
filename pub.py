import paho.mqtt.client as mqtt
import sys

num = int(sys.stdin.readline().strip())

client01 = mqtt.Client(client_id='client01')

client01.connect('192.168.147.190', 1883)
info = client01.publish(topic='ev3', payload=num, qos=1)
if info.rc == 0:
    print(f"success\t{num}")
client01.disconnect()
