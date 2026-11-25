from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.models import LibraryBuilding, LibraryFloor, LibrarySection, LibraryShelf, Book
from app.schemas.schemas import ShelfCreate, SectionCreate, FloorCreate, BuildingCreate
from app.core.security import require_admin

router = APIRouter(prefix="/navigation", tags=["Navigation & Maps"])

@router.get("/hierarchy")
def get_location_hierarchy(db: Session = Depends(get_db)):
    buildings = db.query(LibraryBuilding).all()
    result = []
    for b in buildings:
        floors_data = []
        for f in b.floors:
            sections_data = []
            for s in f.sections:
                shelves_data = []
                for sh in s.shelves:
                    shelves_data.append({
                        "id": sh.id,
                        "aisle": sh.aisle,
                        "shelf_number": sh.shelf_number,
                        "rack_number": sh.rack_number,
                        "bay_number": sh.bay_number,
                        "map_x": sh.map_x,
                        "map_y": sh.map_y,
                        "books_count": len(sh.books)
                    })
                sections_data.append({
                    "id": s.id,
                    "name": s.name,
                    "code": s.code,
                    "color": s.color,
                    "map_x": s.map_x,
                    "map_y": s.map_y,
                    "map_w": s.map_w,
                    "map_h": s.map_h,
                    "shelves": shelves_data
                })
            floors_data.append({
                "id": f.id,
                "floor_number": f.floor_number,
                "name": f.name,
                "sections": sections_data
            })
        result.append({
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "floors": floors_data
        })
    return result

@router.post("/shelves", response_model=dict)
def create_shelf(shelf_in: ShelfCreate, db: Session = Depends(get_db), admin = Depends(require_admin)):
    sec = db.query(LibrarySection).filter(LibrarySection.id == shelf_in.section_id).first()
    if not sec:
        raise HTTPException(status_code=404, detail="Section not found")

    sh = LibraryShelf(
        section_id=shelf_in.section_id,
        aisle=shelf_in.aisle,
        shelf_number=shelf_in.shelf_number,
        rack_number=shelf_in.rack_number,
        bay_number=shelf_in.bay_number,
        map_x=shelf_in.map_x,
        map_y=shelf_in.map_y
    )
    db.add(sh)
    db.commit()
    db.refresh(sh)
    return {"id": sh.id, "message": "Shelf created successfully"}

@router.put("/shelves/{shelf_id}/coordinates")
def update_shelf_coordinates(shelf_id: int, coords: Dict[str, float], db: Session = Depends(get_db), admin = Depends(require_admin)):
    sh = db.query(LibraryShelf).filter(LibraryShelf.id == shelf_id).first()
    if not sh:
        raise HTTPException(status_code=404, detail="Shelf not found")
    sh.map_x = coords.get("x", sh.map_x)
    sh.map_y = coords.get("y", sh.map_y)
    db.commit()
    return {"message": "Coordinates updated successfully", "x": sh.map_x, "y": sh.map_y}

@router.post("/sections", response_model=dict)
def create_section(sec_in: SectionCreate, db: Session = Depends(get_db), admin = Depends(require_admin)):
    fl = db.query(LibraryFloor).filter(LibraryFloor.id == sec_in.floor_id).first()
    if not fl:
        raise HTTPException(status_code=404, detail="Floor not found")

    sec = LibrarySection(
        floor_id=sec_in.floor_id,
        name=sec_in.name,
        code=sec_in.code,
        color=sec_in.color,
        map_x=sec_in.map_x,
        map_y=sec_in.map_y,
        map_w=sec_in.map_w,
        map_h=sec_in.map_h
    )
    db.add(sec)
    db.commit()
    db.refresh(sec)
    return {"id": sec.id, "name": sec.name, "code": sec.code}
