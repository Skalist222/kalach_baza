import datetime
from re import S
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

@app.get("/api/map")
def get_map():

    db = Session()

    buildings = db.query(Building).all()
    rooms = db.query(Room).all()
    beds = db.query(Bed).all()
    placements = db.query(Placement).all()
    visitors = db.query(Visitor).all()
    arrivals = db.query(Arrival).all()
    db.close()
    return {
        "buildings": [b.__dict__ for b in buildings],
        "rooms": [r.__dict__ for r in rooms],
        "beds": [b.__dict__ for b in beds],
        "placements": [p.__dict__ for p in placements],
        "visitors": [v.__dict__ for v in visitors],
        "arrivals": [a.__dict__ for a in arrivals],
    }
    
@app.get("/api/visitors")
def get_map():
    db = Session()
    visitors = db.query(Visitor).all()
    db.close()
    return {
        "visitors": [v.__dict__ for v in visitors],
    }

@app.get("/api/sities")
def get_map():
    db = Session()
    visitors = db.query(Sity).all()
    db.close()
    return {
        "sities": [v.__dict__ for v in visitors],
    }

@app.get("/api/placements")
def get_map():
    db = Session()
    visitors = db.query(Placement).all()
    db.close()
    return {
        "placements": [v.__dict__ for v in visitors],
    }

@app.post("/api/add_visitor")
def add_visitor(name: str,dr:datetime.date,phone:str,sex:boolean):
    db = Session()
    v = Visitor(name=name,dr=dr,phone=phone,sex=sex)
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
def add_arrival(name: str,cost:int):
    db = Session()
    a = Arrival(name=name,cost=cost)
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
def place(visitor_id: int, bed_id: int,status:str, arrival_id: int):
    db = Session()
    placement = Placement(
        visitor_id=visitor_id,
        bed_id=bed_id,
        arrival_id=arrival_id,
        status=status
    )
    db.add(placement)
    db.commit()
    db.close()
    return {"status": "ok"}

@app.post("/api/update_place")
def update_place(visitor_id: int, bed_id: int,status:str, arrival_id: int):
    db = Session()
    placement:Placement = db.query(Placement).filter(and_(Placement.bed_id == bed_id,Placement.arrival_id == arrival_id)).first()
    placement.visitor_id = visitor_id
    db.commit()
    db.close()
    return {"status": "ok"}


@app.post("/api/replace")
def replace(bed_id: int,arrival_id: int):
    db = Session()
    db.query(Placement).filter(and_(Placement.bed_id == bed_id,Placement.arrival_id == arrival_id)).delete()
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