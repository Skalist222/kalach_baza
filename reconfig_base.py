from database import *

from sys import argv
from datetime import datetime
db = Session()




r1 = db.query(Room).filter(Room.number == "31.1").first()
r2 = db.query(Room).filter(Room.number == "31.2").first()

r1.number = "13.1"
r2.number = "13.2"
db.commit()
db.close()

