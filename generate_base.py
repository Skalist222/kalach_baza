from database import *

db = Session()
a = Arrival(name="Тест")
db.add(a)
db.commit()

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



def create_beds(room_id, upper=0, lower=0):

    for i in range(upper):
        db.add(Bed(room_id=room_id, position="upper"))

    for i in range(lower):
        db.add(Bed(room_id=room_id, position="lower"))

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
    create_beds(room.id, upper=2, lower=2)


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
    create_beds(room.id, lower=4)


# ----------------------------
# СЕМЕЙНЫЕ ДОМИКИ
# ----------------------------

houses = ["9.1","9.2","10.1","10.2"]

for h in houses:

    b = create_building("Семейный домик " + h)

    room = create_room(b.id, h)

    create_beds(room.id, lower=8)


# ----------------------------
# ГОСТИНИЦА ДЛЯ ПЕРСОНАЛА
# ----------------------------

b = create_building("Гостиница №12 (персонал)")

rooms = ["12.9","12.10"]

for r in rooms:
    room = create_room(b.id, r)
    create_beds(room.id, lower=4)


# ----------------------------
# МЕДПУНКТ
# ----------------------------

b = create_building("Медпункт")

room = create_room(b.id, "Бокс 1")
create_beds(room.id, lower=2)

room = create_room(b.id, "Бокс 2")
create_beds(room.id, lower=2)


print("База отдыха полностью создана")