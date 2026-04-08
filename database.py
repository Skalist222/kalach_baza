from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Date,Boolean,DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

engine = create_engine("sqlite:///resort.db")
Session = sessionmaker(bind=engine)

Base = declarative_base()

class Sity(Base):
    __tablename__ = "sity"
    id = Column(Integer, primary_key=True)
    name = Column(String)

class Visitor(Base):
    __tablename__ = "visitors"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    dr = Column(Date)
    phone = Column(String)
    # 0-М, 1-Ж
    sex = Column(Boolean)
    sity_id = Column(Integer, ForeignKey("sity.id"))


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True)
    name = Column(String)


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    number = Column(String)


class Bed(Base):
    __tablename__ = "beds"

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    position = Column(String)
    status = Column(String, default="free")


class Arrival(Base):
    __tablename__ = "arrivals"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    cost = Column(Integer)
    start = Column(Date)
    stop = Column(Date)


class Placement(Base):
    __tablename__ = "placements"

    id = Column(Integer, primary_key=True)
    arrival_id = Column(Integer)
    visitor_id = Column(Integer)
    bed_id = Column(Integer)
    status = Column(String)
    start = Column(DateTime)
    stop = Column(DateTime)
    # Оплатил или нет
    buy = Column(Boolean)
    


Base.metadata.create_all(engine)