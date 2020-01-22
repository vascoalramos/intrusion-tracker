import random
from datetime import datetime
import pika
import json
import requests
messages=list()
url = "http://localhost:8080/api/v1/"
headers = {"Content-type": "application/json", "Accept": "*/*"}



def main():
    credentials = pika.PlainCredentials('intrusion_tracker', '123')
    connection = pika.BlockingConnection(pika.ConnectionParameters('192.168.160.220',
                                   5672,
                                   '/',
                                   credentials))
    channel = connection.channel()
    channel.queue_declare(queue="access")

    channel.basic_consume(queue="access", on_message_callback=callback, auto_ack=True)

    print(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()


def callback(ch, method, properties, body):
    global messages
    print(f" [x] Received {body}")
    
    rec=json.loads(body)
    messages.append(rec)
    if len(messages)>50  : #Insert in db when it reaches 50 access logs
        print("Inserting logs in db")
        response = requests.post("http://localhost:8080/api/v1/logs", json=messages, headers=headers)
        print(response.text)
        if response.status_code == 200:
            print(response.text)
            messages.clear()
        elif response.status_code == 404:
            print("Not Found!")
       


if __name__ == "__main__":
    main()

