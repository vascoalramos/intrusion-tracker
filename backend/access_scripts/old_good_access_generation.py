import random
from datetime import datetime
import pika
import requests
from requests.auth import HTTPBasicAuth

import json
import time


def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="access")
    user_ids, room_numbers = [], []
    url = "http://localhost:8080/api/v1/"

    
    # users
    response = requests.get(url+"users/",auth=HTTPBasicAuth("mendes99@ua.pt", "pwd"))
    if response.status_code == 200:
        print("Success!")
        user_ids = [ (u["person"]["id"], u["person"]["accessLevel"]) for u in response.json() ]

    elif response.status_code == 404:
        print("Not Found!")

    # rooms
    response = requests.get(url+"rooms/",auth=HTTPBasicAuth("mendes99@ua.pt", "pwd"))
    if response.status_code == 200:
        print("Success!")
        room_numbers = [ (r["roomNumber"], r["accessLevel"]) for r in response.json() ]

    elif response.status_code == 404:
        print("Not Found!")

    types = ["ENTRY", "EXIT"]
    
    message = {"message_type": "ACCESS"}
    while True:
        good_choices = [
            (user[0], room[0])
            for user in user_ids
            for room in room_numbers
            if user[1] >= room[1]
        ]
        print(f"Good: {good_choices}")
        # Choose random user_id and room_number
        final_user_id, final_room_number = random.choice(good_choices)

        # Choose random type
        final_type = random.choice(types)

        # Generate timestamp
        datetime_obj = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f%Z")


        message["person"] ={"id": final_user_id}
        message["room"] ={"roomNumber": final_room_number}
        message["accessType"] =final_type
        message["timestamp"] =datetime_obj

        channel.basic_publish(
            exchange="",
            routing_key="access",
            body=json.dumps(message, indent=4, sort_keys=True, default=str),
        )
        print(f" [x] Sent {message}")
        time.sleep(2)


    connection.close()


if __name__ == "__main__":
    main()
