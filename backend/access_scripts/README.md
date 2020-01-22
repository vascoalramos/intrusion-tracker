# Intrusion Tracker

## Access Generation Scripts

After receiving the users id's and the room numbers from the database the script will generate a message with the following structure and send it to the proccess_data_stream script located in the server.

* Structure:
```
{
    'message_type': 'ACCESS', 
    'timestamp': '2019-12-03 15:00:45.258892', 
    'person': {"id":1}, 
    'room': {"roomNumber": 152}, 
    'type': 'EXIT'
}
```
The field **message_type** indicates what type of message we are receiving. At the time we only have one type of message, "ACCESS", that records an access of a person to a room.

The field **type** indicates what type of access to a room we are dealing with, an 'ENTRY' or an 'EXIT'.


```
[
    {
        'message_type': 'ACCESS', 
        'data': 
                {
                    'timestamp': '2019-12-03 15:00:45.258892', 
                    'person_id': 1, 
                    'room_number': 152, 
                    'type': 'EXIT'
                }
    },
    {
        'message_type': 'ACCESS', 
        'data': 
                {
                    'timestamp': '2019-12-03 15:00:45.258892', 
                    'person_id': 1, 
                    'room_number': 152, 
                    'type': 'EXIT'
                }
    },
    {
        'message_type': 'ACCESS', 
        'data': 
                {
                    'timestamp': '2019-12-03 15:00:45.258892', 
                    'person_id': 1, 
                    'room_number': 152, 
                    'type': 'EXIT'
                }
    },
    ...
]
```