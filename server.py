import datetime
from xmlrpc.client import boolean

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import and_,or_
from database import *

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/templates", StaticFiles(directory="templates"), name="templates")

templates = Jinja2Templates(directory="templates")



@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse(request,"index.html", {"request": request})


@app.get("/visitor/{visitor_id}", response_class=HTMLResponse)
def visitor(request: Request, visitor_id: int):
    db = Session()

    visitor_obj = db.query(Visitor).filter(Visitor.id == visitor_id).first()

    db.close()

    return templates.TemplateResponse(
        "visitor.html",
        {
            "request": request,
            "user": visitor_obj
        }
    )
    

@app.get("/api/map")
def get_map():

    db = Session()

    buildings = db.query(Building).all()
    rooms = db.query(Room).all()
    beds = db.query(Bed).all()
    placements = db.query(Placement).all()
    visitors = db.query(Visitor).all()
    arrivals = db.query(Arrival).all()
    sities = db.query(Sity).all()
    db.close()
    info = {
        "buildings": [{"id": b.id, "name": b.name} for b in buildings],
        "rooms": [{"id": r.id, "building_id": r.building_id, "number": r.number} for r in rooms],
        "beds": [{"id": b.id, "room_id": b.room_id, "position": b.position} for b in beds],
         "placements": [{
            "id"          :p.id,
            "arrival_id"  :p.arrival_id,
            "visitor_id"  :p.visitor_id,
            "bed_id"      :p.bed_id,
            "status"      :p.status,
            "start"       :p.start,
            "stop"        :p.stop,
            "money"       :p.money,
            "buy"         :p.buy
        }
        for p in placements],
        "visitors": [
            {
                "id": v.id,
                "name": v.name,
                "dr": v.dr,
                "phone": v.phone,
                "sex": v.sex,
                "sity": v.sity_id
            }
            for v in visitors
        ],
        "arrivals": [
            {
                "id": a.id,
                "name": a.name,
                "cost": a.cost,
                "start": a.start,
                "stop": a.stop,
            }
            for a in arrivals
        ],
        "sities":[
            {
                "id":s.id,
                "name":s.name
            }
            for s in sities
        ]
    }
    return info
    
@app.get("/api/visitors")
def get_visitors():
    db = Session()
    visitors = db.query(Visitor).all()
    db.close()
    return {
        "visitors": [v.__dict__ for v in visitors],
    }

@app.get("/api/sities")
def get_sities():
    db = Session()
    visitors = db.query(Sity).all()
    db.close()
    return {
        "sities": [v.__dict__ for v in visitors],
    }

@app.get("/api/placements")
def get_placements():
    db = Session()
    placements = db.query(Placement).all()
    db.close()
    return {
        "placements": [{
            "id"          :p.id,
            "arrival_id"  :p.arrival_id,
            "visitor_id"  :p.visitor_id,
            "bed_id"      :p.bed_id,
            "status"      :p.status,
            "start"       :p.start,
            "stop"        :p.stop,
            "money"       :p.money,
            "buy"         :p.buy
        }
        for p in placements],
    }
    
@app.get("/api/arrivals")
def get_arrivals():
    db = Session()
    visitors = db.query(Arrival).all()
    db.close()
    return {
        "arrivals": [v.__dict__ for v in visitors],
    }

@app.post("/api/add_visitor")
def add_visitor(name: str,dr:datetime.date,phone:str,sex:boolean,sity_id:int):
    db = Session()
    v = Visitor(name=name,dr=dr,phone=phone,sex=sex,sity_id=sity_id)
    db.add(v)
    db.commit()
    db.close()
    return {"status": "ok"}



@app.post("/api/add_sity")
def add_sity(name: str):
    db = Session()
    v = Sity(name=name)
    db.add(v)
    db.commit()
    db.close()
    return {"status": "ok"}


@app.post("/api/add_sity")
def add_visitor(name: str):
    db = Session()
    s = Sity(name=name)
    db.add(s)
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/add_arrival")
def add_arrival(name: str,cost:int,start:datetime.date,stop:datetime.date):
    db = Session()
    a = Arrival(name=name,cost=cost,start=start,stop=stop)
    db.add(a)
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/add_building")
def add_building(name: str):
    db = Session()
    b = Building(name=name)
    db.add(b)
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/place")
def place(visitor_id: int, bed_id: int,status:str, arrival_id: int,money:float):
    db = Session()
    placement = Placement(
        visitor_id=visitor_id,
        bed_id=bed_id,
        arrival_id=arrival_id,
        status=status,
        money = money,
        buy = money > 0
    )
    db.add(placement)
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/update_place")
def update_place(visitor_id: int, bed_id: int,status:str, arrival_id: int,money:float):
    db = Session()   
    placement:Placement = db.query(Placement).filter(and_(Placement.bed_id == bed_id,Placement.arrival_id == arrival_id)).first()
    if not placement: 
        print("Плейсмент не найден")
        return {"status": "error","error":"placements not found"}
    placement.visitor_id = visitor_id
    placement.money = money
    placement.status = status
    if(placement.money>0):placement.buy = True
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/update_visitor")
def update_visitor(visitor_id: int, name: str, dr: str, phone: str):
    db = Session()

    visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if not visitor:
        return {"status": "error", "error": "visitor not found"}

    visitor.name = name.strip()
    visitor.phone = phone.strip()

    # 🔥 ВАЖНО
    visitor.dr = datetime.date.fromisoformat(dr.strip())

    db.commit()
    db.close()

    return {"status": "ok"}



@app.post("/api/move_place")
def move_place(visitor_id: int, old_bed_id: int,new_bed_id: int, arrival_id: int):
    db = Session()
    placement:Placement = db.query(Placement).filter(and_(Placement.bed_id == old_bed_id,Placement.arrival_id == arrival_id)).first()
    if not placement: return {"status": "error","error":"placements not found"}
    placement.bed_id = new_bed_id
    if(placement.money>0):placement.buy = True
    db.commit()
    db.close()
    return {"status": "ok"}


@app.post("/api/replace")
def replace(visitor_id:int,bed_id: int,arrival_id: int):
    db = Session()
    db.query(Placement).filter(and_(Placement.bed_id == bed_id,Placement.arrival_id == arrival_id,Placement.visitor_id == visitor_id)).delete()
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/delete_visitor")
def delete_visitor(visitor_id: int):
    db = Session()
    visitor = db.query(Visitor).filter(Visitor.id == visitor_id).first()
    if not visitor:
        return {"status": "error", "error": "visitor not found"}
    db.delete(visitor)
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/delete_arrival")
def delete_arrival(arrival_id: int):
    db = Session()
    visitor = db.query(Arrival).filter(Arrival.id == arrival_id).first()
    if not visitor:
        return {"status": "error", "error": "visitor not found"}
    db.delete(visitor)
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/add_room")
def add_room(building_id: int, number: str):
    db = Session()
    room = Room(
        building_id=building_id,
        number=number
    )
    db.add(room)
    db.commit()
    db.close()
    return {"status": "ok"}