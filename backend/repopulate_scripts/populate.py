import random
from datetime import datetime
import requests
from requests.auth import HTTPBasicAuth
import json
from faker import Faker

def main():

    faker = Faker()
    headers = {"Content-type": "application/json", "Accept": "*/*"}
    url = "http://192.168.160.220:8080/api/v1/"
    company_id = 0
    persons_ids = []
    team_leaders_ids=[]
    team_ids = []
    dept_ids = []
    first_names=[]

    # Create company
    myobj = {
        "name": "UV",
        "email": "ua1999@ua.pt",
        "phoneNumber": "+351234372565",
        "address": "Rua de Aveiro",
    }
    response = requests.post(url + "companies-reg", json=myobj, headers=headers)

    if response.status_code == 200:
        company_id = response.json()["id"]
        print("Added Company")
    elif response.status_code == 404:
        print("Not Found!")

    
    # Create users
    # 1 admin 
    myobj = {
        "phoneNumber": "+351913654912",
        "role": "admin",
        "person": {
            "email": "j.vasconcelos99@ua.pt",
            "fname": "Joao",
            "lname": "Vasconcelos",
            "accessLevel": "1",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        persons_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")
    # 2 admin
    myobj = {
        "phoneNumber": "+351913654123",
        "role": "admin",
        "person": {
            "email": "vascoalramos@ua.pt",
            "fname": "Vasco",
            "lname": "Ramos",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        persons_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")
    # 3 admin
    myobj = {
        "phoneNumber": "+351913654145",
        "role": "admin",
        "person": {
            "email": "antonio99@ua.pt",
            "fname": "Antonio",
            "lname": "Vasconcelos",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        persons_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")
    # 4 admin
    myobj = {
        "phoneNumber": "+351913654140",
        "role": "admin",
        "person": {
            "email": "bs@ua.pt",
            "fname": "Beatriz",
            "lname": "Silva",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        persons_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")
    # 5 admin
    myobj = {
        "phoneNumber": "+351913654567",
        "role": "admin",
        "person": {
            "email": "tomas99@ua.pt",
            "fname": "Tomas",
            "lname": "Costa",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        persons_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")

    # 1 team Leader
    myobj = {
        "phoneNumber": "+351921346789",
        "role": "team_leader",
        "person": {
            "email": "tiagocmendes@ua.pt",
            "fname": "Tiago",
            "lname": "Mendes",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        team_leaders_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")

    # 2 team Leader
    myobj = {
        "phoneNumber": "+351956346789",
        "role": "team_leader",
        "person": {
            "email": "maria99@ua.pt",
            "fname": "Maria",
            "lname": "Mendes",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        team_leaders_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")

    # 3 team Leader
    myobj = {
        "phoneNumber": "+351921304789",
        "role": "team_leader",
        "person": {
            "email": "mario99@ua.pt",
            "fname": "Mário",
            "lname": "Mendes",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        team_leaders_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")

    # 4 team Leader
    myobj = {
        "phoneNumber": "+351989304789",
        "role": "team_leader",
        "person": {
            "email": "sofia99@ua.pt",
            "fname": "Sofia",
            "lname": "Nunes",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        team_leaders_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")
    
    # 5 team Leader
    myobj = {
        "phoneNumber": "+351921564789",
        "role": "team_leader",
        "person": {
            "email": "helder@ua.pt",
            "fname": "Helder",
            "lname": "Jesus",
            "accessLevel": "2",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        team_leaders_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")

    # 1 security_enforcer
    myobj = {
        "phoneNumber": "+351917854345",
        "role": "security_enforcer",
        "person": {
            "email": "diogo04@ua.pt",
            "fname": "Diogo",
            "lname": "Silva",
            "accessLevel": "3",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        persons_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")

    # 2 security_enforcer
    myobj = {
        "phoneNumber": "+351917878345",
        "role": "security_enforcer",
        "person": {
            "email": "nc@ua.pt",
            "fname": "Nunes",
            "lname": "Cunha",
            "accessLevel": "3",
            "company": {"id": company_id},
        },
    }
    response = requests.post(url + "internal_registration", json=myobj, headers=headers)
    if response.status_code == 200:
        persons_ids.append(response.json()["person"]["id"])
        print("Added Person")
    elif response.status_code == 404:
        print("Not Found!")

    # Create team
    # team 1
    myobj = {"teamName": "Yellow"}
    response = requests.post(
        url + "teams",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        team_ids.append(response.json()["id"])
        print("Added Team")
    elif response.status_code == 404:
        print("Not Found!")

    # team 2
    myobj = {"teamName": "Blue"}
    response = requests.post(
        url + "teams",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        team_ids.append(response.json()["id"])
        print("Added Team")
    elif response.status_code == 404:
        print("Not Found!")

    # team 3
    myobj = {"teamName": "Red"}
    response = requests.post(
        url + "teams",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        team_ids.append(response.json()["id"])
        print("Added Team")
    elif response.status_code == 404:
        print("Not Found!")
    
     # team 4
    myobj = {"teamName": "Green"}
    response = requests.post(
        url + "teams",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        team_ids.append(response.json()["id"])
        print("Added Team")
    elif response.status_code == 404:
        print("Not Found!")

     # team 5
    myobj = {"teamName": "Black"}
    response = requests.post(
        url + "teams",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        team_ids.append(response.json()["id"])
        print("Added Team")
    elif response.status_code == 404:
        print("Not Found!")

    #Add team leader to Team:
    for index,person_id in enumerate(team_leaders_ids):

        myobj = {"teamId": team_ids[index], "personId": person_id}
        response = requests.post(
            url + "add-to-team",
            json=myobj,
            headers=headers,
            auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
        )
        if response.status_code == 200:
            print("Added Team Leader to Team")
        elif response.status_code == 404:
            print("Not Found!")

    # Add person to team
    for person_id in persons_ids:
        myobj = {"teamId": random.choice(team_ids), "personId": person_id}
        response = requests.post(
            url + "add-to-team",
            json=myobj,
            headers=headers,
            auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
        )
        if response.status_code == 200:
            print("Added Person to Team")
        elif response.status_code == 404:
            print("Not Found!")

    

    # Create departments
    # department 1
    myobj = {"departmentName": "IT"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")
    # department 2
    myobj = {"departmentName": "RH"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")

    # department 3
    myobj = {"departmentName": "DEVOPS"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")

    # department 4
    myobj = {"departmentName": "Marketing"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")

    # department 5
    myobj = {"departmentName": "Social"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")
    
    # department 6
    myobj = {"departmentName": "Design"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")
    
    # department 7
    myobj = {"departmentName": "Finances"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")
    
    #department 8
    myobj = {"departmentName": "Security"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")
    
    #department 9
    myobj = {"departmentName": "Maintenance"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")

    #department 10
    myobj = {"departmentName": "Client Support"}
    response = requests.post(
        url + "departments",
        json=myobj,
        headers=headers,
        auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
    )
    if response.status_code == 200:
        dept_ids.append(response.json()["id"])
        print("Added Department")
    elif response.status_code == 404:
        print("Not Found!")

    # Add person and team leader to department
    total_persons=persons_ids+team_leaders_ids
    for person_id in total_persons:
        myobj = {"deptId": random.choice(dept_ids), "personId": person_id}
        response = requests.post(
            url + "add-to-department",
            json=myobj,
            headers=headers,
            auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
        )
        if response.status_code == 200:
            print("Added Person to Department")
        elif response.status_code == 404:
            print("Not Found!")

    # Create rooms
    # room 1

    for index,dept in enumerate(dept_ids):
        for i in range(0,10):
            room_number=str(index)+str(i)
            height=random.randrange(50,100)
            width=random.randrange(50,100)
            max_occupation=random.randrange(5,15)
            floor=random.randrange(0,4)
            access_level=random.randrange(1,5)

            myobj = {
                "roomNumber": room_number,
                "height": height,
                "width": width,
                "maxOccupation": max_occupation,
                "floor": floor,
                "accessLevel": access_level,
                "dept": {"id": dept},
            }
            response = requests.post(
                url + "rooms",
                json=myobj,
                headers=headers,
                auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
            )
            if response.status_code == 200:
                print(f"Added Room {room_number}")
            elif response.status_code == 404:
                print("Not Found!")
    

    
    # Create employees

    for i in range(0,500):
        first_name=faker.first_name()
        last_name=faker.last_name()
        email=first_name+"_"+last_name+"_"+str(i)+"@ua.pt"
        
        myobj = {
            
            "email": email,
            "fname": first_name,
            "lname": last_name,
            "team":{"id":random.choice(team_ids)},
            "dept":{"id":random.choice(dept_ids)},
            "accessLevel": random.randrange(1,5),
            "company": {"id": company_id},
            
        }
        response = requests.post(
            url + "persons",
            json=myobj,
            headers=headers,
            auth=HTTPBasicAuth("j.vasconcelos99@ua.pt", "pwd"),
        )
        if response.status_code == 200:
            #persons_ids.append(response.json()["person"]["id"])
            print(f"Added Employee {i} {myobj}")
        elif response.status_code == 404:
            print("Not Found!")



if __name__ == "__main__":
    main()
