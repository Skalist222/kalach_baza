from database import *

from faker import Faker
from random import choice,randint
from sys import argv
from datetime import datetime
db = Session()

if(len(argv) == 3):
    if(argv[1] == "test"):
        
        fake = Faker('ru_RU')
        a = Arrival(name="Тест",cost=2000)
        count_visitors = int(argv[2])
        
        for v in range(count_visitors):
            sex = randint(0,1)
            name = fake.name_male() if sex == 1 else fake.name_female()
            dr = datetime.strptime(fake.date(),"%Y-%m-%d")
            phone = fake.phone_number()
            visitor = Visitor(name=name,dr = dr,phone=phone,sex=(sex==1)) 
            db.add(visitor)
        db.add(a)
        db.commit()
# a = Arrival(name="Тест",cost=2000)
# db.add(a)
# db.commit()

def create_building(name):
    b = Building(name=name)
    db.add(b)
    db.commit()
    return b


def create_room(building_id, number):
    r = Room(building_id=building_id, number=number)
    db.add(r)
    db.commit()
    return r



def create_beds(room_id, upper=0, lower=0,bigger=0):

    for i in range(upper):
        db.add(Bed(room_id=room_id, position="upper"))

    for i in range(lower):
        db.add(Bed(room_id=room_id, position="lower"))
    
    for i in range(bigger):
        db.add(Bed(room_id=room_id, position="bigger-left"))
        db.add(Bed(room_id=room_id, position="bigger-rigth"))

    db.commit()


# ----------------------------
# КОРПУС 3
# ----------------------------

b = create_building("Корпус 3")

rooms = ["3.1","3.2","3.3","3.4","3.5","3.6","3.7","3.8"]

for r in rooms:
    room = create_room(b.id, r)
    create_beds(room.id, upper=4, lower=4)


# ----------------------------
# КОРПУС 4
# ----------------------------

b = create_building("Корпус 4")

rooms = ["4.1","4.2","4.3","4.4","4.5","4.6","4.7","4.8"]

for r in rooms:
    room = create_room(b.id, r)
    create_beds(room.id, upper=4, lower=4)


# ----------------------------
# КОРПУС 5 БАННЫЙ
# ----------------------------

b = create_building("Корпус 5 (Банный)")

rooms = ["5.11","5.12"]
for r in rooms:
    room = create_room(b.id, r)
    create_beds(room.id, upper=1, lower=1,bigger=1)

rooms = ["5.7","5.9"]
for r in rooms:
    room = create_room(b.id, r)
    create_beds(room.id, bigger=1)
    


# ----------------------------
# КОРПУС 6
# ----------------------------

b = create_building("Корпус 6")

# комната 6.2
room = create_room(b.id, "6.2")
create_beds(room.id, upper=5, lower=5)

# остальные комнаты
rooms = ["6.4","6.5","6.6","6.7"]

for r in rooms:
    room = create_room(b.id, r)
    create_beds(room.id, lower=2,upper=2)


# ----------------------------
# СЕМЕЙНЫЕ ДОМИКИ
# ----------------------------

houses = ["9.1","9.2","10.1","10.2"]

for h in houses:

    b = create_building("Семейный домик " + h)

    room = create_room(b.id, h)

    create_beds(room.id, upper=4,lower=3,bigger=1)


# ----------------------------
# ГОСТИНИЦА ДЛЯ ПЕРСОНАЛА
# ----------------------------

b = create_building("Гостиница №12 (персонал)")

rooms = ["12.9","12.10"]

for r in rooms:
    room = create_room(b.id, r)
    create_beds(room.id, lower=3,upper=2)


# ----------------------------
# МЕДПУНКТ
# ----------------------------

b = create_building("Корпус 13(персонал)")
room = create_room(b.id, "31.1")
create_beds(room.id, lower=8,upper=2)
room = create_room(b.id, "31.2")
create_beds(room.id, lower=8,upper=2)

b = create_building("Медпункт")

room = create_room(b.id, "Бокс 1")
create_beds(room.id, lower=2)

room = create_room(b.id, "Бокс 2")
create_beds(room.id, lower=2)



print("База отдыха полностью создана")