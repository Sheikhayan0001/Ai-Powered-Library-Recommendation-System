import os
import json
from app.database.connection import SessionLocal, engine, Base
from app.models.models import (
    Role, User, Subject, LibraryBuilding, LibraryFloor,
    LibrarySection, LibraryShelf, Book, RAGChunk
)
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Roles
        admin_role = db.query(Role).filter_by(name="ADMIN").first()
        if not admin_role:
            admin_role = Role(name="ADMIN")
            db.add(admin_role)

        student_role = db.query(Role).filter_by(name="STUDENT").first()
        if not student_role:
            student_role = Role(name="STUDENT")
            db.add(student_role)
        db.commit()

        # 2. Seed Default Admin & Demo Student
        admin_user = db.query(User).filter_by(email="admin@lpu.in").first()
        if not admin_user:
            admin_user = User(
                email="admin@lpu.in",
                hashed_password=get_password_hash("Admin@123"),
                full_name="Chief Librarian Admin",
                student_id="LPU-ADMIN-01",
                role_id=admin_role.id,
                department="Central Library Management",
                is_active=True
            )
            db.add(admin_user)

        demo_student = db.query(User).filter_by(email="student@lpu.in").first()
        if not demo_student:
            demo_student = User(
                email="student@lpu.in",
                hashed_password=get_password_hash("Student@123"),
                full_name="Ayan Sheikh",
                student_id="12104589",
                role_id=student_role.id,
                department="Computer Science & Engineering",
                is_active=True
            )
            db.add(demo_student)
        db.commit()

        # 3. Seed Library Buildings, Floors, Sections & Shelves
        bldg = db.query(LibraryBuilding).filter_by(name="Central Academic Library").first()
        if not bldg:
            bldg = LibraryBuilding(
                name="Central Academic Library",
                description="Main University Library building housing CS, Math, and Engineering domains."
            )
            db.add(bldg)
            db.commit()

        floor1 = db.query(LibraryFloor).filter_by(building_id=bldg.id, floor_number=1).first()
        if not floor1:
            floor1 = LibraryFloor(
                building_id=bldg.id,
                floor_number=1,
                name="Floor 1 - Ground Level & Sciences"
            )
            db.add(floor1)

        floor2 = db.query(LibraryFloor).filter_by(building_id=bldg.id, floor_number=2).first()
        if not floor2:
            floor2 = LibraryFloor(
                building_id=bldg.id,
                floor_number=2,
                name="Floor 2 - Computer Science & AI Research"
            )
            db.add(floor2)
        db.commit()

        # Sections
        sec_cs_f2 = db.query(LibrarySection).filter_by(floor_id=floor2.id, code="CS").first()
        if not sec_cs_f2:
            sec_cs_f2 = LibrarySection(
                floor_id=floor2.id,
                name="Computer Science & Artificial Intelligence",
                code="CS",
                color="#DC2626",
                map_x=20, map_y=20, map_w=220, map_h=120
            )
            db.add(sec_cs_f2)

        sec_cs_f1 = db.query(LibrarySection).filter_by(floor_id=floor1.id, code="CS-CORE").first()
        if not sec_cs_f1:
            sec_cs_f1 = LibrarySection(
                floor_id=floor1.id,
                name="Computer Science Core & Databases",
                code="CS-CORE",
                color="#DC2626",
                map_x=20, map_y=20, map_w=180, map_h=120
            )
            db.add(sec_cs_f1)

        sec_math = db.query(LibrarySection).filter_by(floor_id=floor1.id, code="MATH").first()
        if not sec_math:
            sec_math = LibrarySection(
                floor_id=floor1.id,
                name="Mathematics & Statistics",
                code="MATH",
                color="#2563EB",
                map_x=220, map_y=20, map_w=140, map_h=120
            )
            db.add(sec_math)

        sec_net = db.query(LibrarySection).filter_by(floor_id=floor1.id, code="NET").first()
        if not sec_net:
            sec_net = LibrarySection(
                floor_id=floor1.id,
                name="Computer Networks & Security",
                code="NET",
                color="#10B981",
                map_x=380, map_y=20, map_w=100, map_h=120
            )
            db.add(sec_net)
        db.commit()

        # Shelves (Demo coordinates)
        shelves_config = [
            {"sec": sec_cs_f2, "aisle": "A3", "shelf": "S05", "rack": "R02", "bay": "B04", "x": 60, "y": 60},
            {"sec": sec_cs_f2, "aisle": "A3", "shelf": "S06", "rack": "R01", "bay": "B02", "x": 80, "y": 60},
            {"sec": sec_cs_f2, "aisle": "A4", "shelf": "S02", "rack": "R01", "bay": "B03", "x": 120, "y": 60},
            {"sec": sec_cs_f2, "aisle": "A3", "shelf": "S07", "rack": "R01", "bay": "B03", "x": 100, "y": 60},
            {"sec": sec_cs_f1, "aisle": "B2", "shelf": "S03", "rack": "R04", "bay": "B02", "x": 50, "y": 50},
            {"sec": sec_cs_f1, "aisle": "B1", "shelf": "S07", "rack": "R02", "bay": "B05", "x": 90, "y": 50},
            {"sec": sec_net,   "aisle": "C1", "shelf": "S01", "rack": "R03", "bay": "B01", "x": 400, "y": 50},
            {"sec": sec_math,  "aisle": "D2", "shelf": "S04", "rack": "R01", "bay": "B02", "x": 260, "y": 50},
        ]
        shelf_map = {}
        for sc in shelves_config:
            key = f"{sc['sec'].id}-{sc['aisle']}-{sc['shelf']}"
            sh = db.query(LibraryShelf).filter_by(
                section_id=sc["sec"].id,
                aisle=sc["aisle"],
                shelf_number=sc["shelf"]
            ).first()
            if not sh:
                sh = LibraryShelf(
                    section_id=sc["sec"].id,
                    aisle=sc["aisle"],
                    shelf_number=sc["shelf"],
                    rack_number=sc["rack"],
                    bay_number=sc["bay"],
                    map_x=sc["x"],
                    map_y=sc["y"]
                )
                db.add(sh)
                db.commit()
            shelf_map[f"{sc['aisle']}-{sc['shelf']}"] = sh

        # 4. Seed Subjects
        subjects_data = [
            {"name": "AI", "icon": "🤖", "color": "#DC2626", "desc": "Artificial Intelligence & Search Algorithms"},
            {"name": "ML", "icon": "🧠", "color": "#EA580C", "desc": "Machine Learning & Statistical Patterns"},
            {"name": "Deep Learning", "icon": "⚡", "color": "#7C3AED", "desc": "Neural Networks & Representation Learning"},
            {"name": "NLP", "icon": "💬", "color": "#0284C7", "desc": "Natural Language Processing & Speech"},
            {"name": "Algorithms", "icon": "⚙️", "color": "#16A34A", "desc": "Data Structures & Algorithmic Analysis"},
            {"name": "Databases", "icon": "🗄️", "color": "#CA8A04", "desc": "Relational, NoSQL & Distributed Databases"},
            {"name": "Networking", "icon": "🌐", "color": "#0D9488", "desc": "Internet Architecture & Protocols"},
            {"name": "Mathematics", "icon": "📐", "color": "#2563EB", "desc": "Linear Algebra, Calculus & Probability"},
            {"name": "Neural Networks", "icon": "🕸️", "color": "#9333EA", "desc": "Artificial Neural Architectures"},
        ]
        subj_map = {}
        for s in subjects_data:
            subj = db.query(Subject).filter_by(name=s["name"]).first()
            if not subj:
                subj = Subject(name=s["name"], description=s["desc"], icon=s["icon"], color=s["color"])
                db.add(subj)
                db.commit()
            subj_map[s["name"]] = subj

        # 5. Seed Canonical Books from Prompt
        canonical_books = [
            {
                "isbn": "978-0136042594",
                "title": "Artificial Intelligence: A Modern Approach",
                "author": "Stuart Russell, Peter Norvig",
                "publisher": "Pearson",
                "year": 2020, "pages": 1152,
                "subject": "AI",
                "difficulty": "Advanced",
                "cover_url": "https://books.google.com/books/content?id=koFptAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
                "description": "The authoritative textbook on artificial intelligence covering agents, search, logic, learning, perception and robotics.",
                "topics": ["Search", "Logic", "Knowledge Representation", "Probabilistic Reasoning", "Machine Learning"],
                "prerequisites": ["Algorithms", "Linear Algebra", "Probability"],
                "shelf_key": "A3-S05",
                "total_copies": 8, "available_copies": 7
            },
            {
                "isbn": "978-1492032649",
                "title": "Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow",
                "author": "Aurélien Géron",
                "publisher": "O'Reilly Media",
                "year": 2019, "pages": 850,
                "subject": "ML",
                "difficulty": "Intermediate",
                "cover_url": "https://m.media-amazon.com/images/I/71UF9mDAX3L.jpg",
                "description": "Practical guide to building intelligent systems using concrete Python examples and state-of-the-art libraries.",
                "topics": ["Classification", "Regression", "Ensemble Learning", "Neural Nets", "TensorFlow"],
                "prerequisites": ["Python", "Linear Algebra"],
                "shelf_key": "A3-S06",
                "total_copies": 10, "available_copies": 9
            },
            {
                "isbn": "978-0262035613",
                "title": "Deep Learning",
                "author": "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
                "publisher": "MIT Press",
                "year": 2016, "pages": 800,
                "subject": "Deep Learning",
                "difficulty": "Advanced",
                "cover_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqazE_-VHsi-_UFMV53a5i0ue9lgNRrrqqtZ4816M4VMsTLbb_uibdv3g&s=10",
                "description": "The definitive resource on deep learning written by pioneers of the field, covering mathematical foundations to modern generative models.",
                "topics": ["Deep Feedforward Networks", "CNN", "RNN", "Autoencoders", "Generative Models"],
                "prerequisites": ["Machine Learning", "Multivariate Calculus", "Linear Algebra"],
                "shelf_key": "A3-S06",
                "total_copies": 6, "available_copies": 5
            },
            {
                "isbn": "978-0131873216",
                "title": "Speech and Language Processing",
                "author": "Dan Jurafsky, James H. Martin",
                "publisher": "Prentice Hall",
                "year": 2023, "pages": 1032,
                "subject": "NLP",
                "difficulty": "Advanced",
                "cover_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAPi9OfKDgSh0IrGysiJNhSC9yEBTBT9bmbHlZ1qKgsg&s=10",
                "description": "Comprehensive reference covering computational linguistics, speech synthesis, transformers, language models, and text analysis.",
                "topics": ["N-grams", "Transformers", "POS Tagging", "Parsing", "Speech Recognition"],
                "prerequisites": ["Python", "Probability", "Algorithms"],
                "shelf_key": "A4-S02",
                "total_copies": 5, "available_copies": 5
            },
            {
                "isbn": "978-0262046305",
                "title": "Introduction to Algorithms (CLRS)",
                "author": "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
                "publisher": "MIT Press",
                "year": 2022, "pages": 1312,
                "subject": "Algorithms",
                "difficulty": "Intermediate",
                "cover_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHRgok1ykrB5cKf-olnAJyPh5K3RXUq2da9uWMVvPNiw&s=10",
                "description": "The globally acclaimed algorithms textbook offering a rigorous yet comprehensive analysis of fundamental algorithmic design paradigms.",
                "topics": ["Sorting", "Dynamic Programming", "Greedy Algorithms", "Graph Algorithms", "NP-Completeness"],
                "prerequisites": ["Discrete Mathematics", "Data Structures"],
                "shelf_key": "B2-S03",
                "total_copies": 15, "available_copies": 12
            },
            {
                "isbn": "978-0078022159",
                "title": "Database System Concepts",
                "author": "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
                "publisher": "McGraw-Hill",
                "year": 2019, "pages": 1376,
                "subject": "Databases",
                "difficulty": "Intermediate",
                "cover_url": "https://m.media-amazon.com/images/I/81B3Cv13cYL.jpg",
                "description": "Foundational database systems textbook exploring relational models, SQL, transactions, indexing, concurrency, and distributed storage.",
                "topics": ["Relational Model", "SQL", "Normalization", "Indexing", "Transactions"],
                "prerequisites": ["Data Structures"],
                "shelf_key": "B1-S07",
                "total_copies": 12, "available_copies": 11
            },
            {
                "isbn": "978-0133594140",
                "title": "Computer Networking: A Top-Down Approach",
                "author": "James F. Kurose, Keith W. Ross",
                "publisher": "Pearson",
                "year": 2021, "pages": 864,
                "subject": "Networking",
                "difficulty": "Beginner",
                "cover_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ770IVfLKI3mjZkJT5o4JL2GT4NC5iv6Tbmtiz_SfbUw&s=10",
                "description": "Pedagogical top-down approach focusing on the Internet architecture, transport layer protocols, IP routing, and network security.",
                "topics": ["Application Layer", "TCP/UDP", "IP Routing", "Link Layer", "Network Security"],
                "prerequisites": [],
                "shelf_key": "C1-S01",
                "total_copies": 10, "available_copies": 8
            },
            {
                "isbn": "978-1492041139",
                "title": "Neural Networks and Deep Learning",
                "author": "Michael Nielsen",
                "publisher": "Determination Press",
                "year": 2018, "pages": 300,
                "subject": "Neural Networks",
                "difficulty": "Intermediate",
                "cover_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNtnZODFzAHGme2_7yYdSxFlSR0ZhahaZbBHdeilnI7w&s=10",
                "description": "Clear conceptual guide to the core principles behind neural networks, backpropagation, and deep architectures.",
                "topics": ["Perceptrons", "Backpropagation", "Gradient Descent", "CNNs"],
                "prerequisites": ["Calculus", "Basic Python"],
                "shelf_key": "A3-S07",
                "total_copies": 7, "available_copies": 6
            },
            {
                "isbn": "978-1108455145",
                "title": "Mathematics for Machine Learning",
                "author": "Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong",
                "publisher": "Cambridge University Press",
                "year": 2020, "pages": 417,
                "subject": "Mathematics",
                "difficulty": "Beginner",
                "cover_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt5Jz5UV_B0twXeEgJK1PKl1BnFMMJwJNxUlgdvFILxg&s=10",
                "description": "Mathematical foundations for data science, machine learning, and AI including linear algebra, analytic geometry, and optimization.",
                "topics": ["Linear Algebra", "Vector Calculus", "Probability Distributions", "Continuous Optimization"],
                "prerequisites": ["High School Mathematics"],
                "shelf_key": "D2-S04",
                "total_copies": 9, "available_copies": 9
            }
        ]

        for b in canonical_books:
            existing = db.query(Book).filter_by(isbn=b["isbn"]).first()
            if not existing:
                shelf = shelf_map.get(b["shelf_key"])
                subj = subj_map.get(b["subject"])
                book = Book(
                    isbn=b["isbn"],
                    title=b["title"],
                    author=b["author"],
                    publisher=b["publisher"],
                    year=b["year"],
                    pages=b["pages"],
                    subject_id=subj.id if subj else 1,
                    difficulty=b["difficulty"],
                    cover_url=b["cover_url"],
                    description=b["description"],
                    topics=b["topics"],
                    prerequisites=b["prerequisites"],
                    shelf_id=shelf.id if shelf else None,
                    total_copies=b["total_copies"],
                    available_copies=b["available_copies"]
                )
                db.add(book)
                db.commit()

                # Add initial RAG chunk for each book
                loc_text = f"Floor {shelf.section.floor.floor_number}, Section {shelf.section.name}, Aisle {shelf.aisle}, Shelf {shelf.shelf_number}, Rack {shelf.rack_number}, Bay {shelf.bay_number}" if shelf else "Central Stacks"
                rag_content = f"Book: {b['title']}\nAuthor: {b['author']}\nSubject: {b['subject']}\nDifficulty: {b['difficulty']}\nTopics: {', '.join(b['topics'])}\nPrerequisites: {', '.join(b['prerequisites']) or 'None'}\nPhysical Location (DEMO DATA): {loc_text}\nSummary: {b['description']}"
                chunk = RAGChunk(
                    book_id=book.id,
                    chunk_type="book_metadata",
                    title=f"Metadata - {book.title}",
                    content=rag_content,
                    metadata_json={"isbn": b["isbn"], "subject": b["subject"]}
                )
                db.add(chunk)
                db.commit()

        print("Database seed completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
