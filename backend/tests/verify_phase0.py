"""
MAJRA Phase 0 Verification Script
Tests Database Seeding, JWT Auth, Real CV Parsing, Matching Engine, and Admin Controls end-to-end.
"""

import sys
import io
from pathlib import Path

# Force UTF-8 on Windows stdout
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, init_db
from app.models.database import User, Job, Skill, CVDocument, Company
from app.services.db_seeder import seed_database_if_empty

client = TestClient(app)


def test_phase0_all():
    print("==================================================")
    print("[*] STARTING MAJRA PHASE 0 END-TO-END VERIFICATION")
    print("==================================================")

    # 1. Database Initialization & Seeding
    print("\n[1/7] Testing Database Init & Seeding...")
    init_db()
    db = SessionLocal()
    seed_res = seed_database_if_empty(db)
    skills_count = db.query(Skill).count()
    jobs_count = db.query(Job).count()
    companies_count = db.query(Company).count()
    print(f"  [OK] Database Tables Created.")
    print(f"  [OK] Canonical Skills in Database: {skills_count}")
    print(f"  [OK] Jobs in Database: {jobs_count}")
    print(f"  [OK] Companies in Database: {companies_count}")
    assert skills_count >= 50, f"Skills count too low: {skills_count}"
    assert jobs_count >= 40, f"Jobs count too low: {jobs_count}"
    db.close()

    # 2. Auth: User Registration
    print("\n[2/7] Testing User Registration (/api/auth/register)...")
    test_email = "ahmed.ali@majra.ai"
    # Clean up prior test user if exists
    db = SessionLocal()
    existing_user = db.query(User).filter(User.email == test_email).first()
    if existing_user:
        db.delete(existing_user)
        db.commit()
    db.close()

    reg_payload = {
        "email": test_email,
        "password": "SecurePassword123!",
        "full_name": "Ahmed Ali",
        "target_role": "Data Analyst",
        "experience_years": 2
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    print(f"  Status Code: {reg_res.status_code}")
    assert reg_res.status_code == 201, f"Registration failed: {reg_res.text}"
    reg_data = reg_res.json()
    token = reg_data["access_token"]
    print(f"  [OK] User Registered: {reg_data['email']} (ID: {reg_data['user_id']})")
    print(f"  [OK] JWT Token Generated: {token[:25]}...")

    # 3. Auth: Login & Protected /me endpoint
    print("\n[3/7] Testing User Login & Protected /me (/api/auth/login, /api/auth/me)...")
    login_res = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    login_token = login_res.json()["access_token"]

    # Call /api/auth/me
    headers = {"Authorization": f"Bearer {login_token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200, f"Get /me failed: {me_res.text}"
    me_data = me_res.json()
    print(f"  [OK] Authenticated as: {me_data['full_name']} ({me_data['email']})")
    print(f"  [OK] User Target Role: {me_data['profile']['target_role']}")

    # 4. Auth: Update User Profile
    print("\n[4/7] Testing Profile Update (/api/auth/profile)...")
    update_res = client.put("/api/auth/profile", headers=headers, json={
        "skills": ["SQL", "Python", "Power BI", "Tableau"],
        "target_role": "Senior BI Analyst",
        "experience_years": 3
    })
    assert update_res.status_code == 200
    updated_profile = update_res.json()
    print(f"  [OK] Profile Updated: Role='{updated_profile['target_role']}', Skills={updated_profile['skills']}")

    # 5. Real CV Upload & ATS Analysis
    print("\n[5/7] Testing Real CV Upload & ATS Analysis (/api/cv/upload)...")
    sample_cv_text = """
    AHMED ALI
    Cairo, Egypt | ahmed.ali@majra.ai | +20 100 123 4567 | linkedin.com/in/ahmed-ali

    PROFESSIONAL SUMMARY
    Results-driven Data Analyst with 3 years of experience in SQL, Python, and Power BI.
    Developed 25+ analytics dashboards and automated ETL pipelines reducing manual reporting time by 40%.

    WORK EXPERIENCE
    Data Analyst | Tech Solutions Egypt (2023 - Present)
    - Developed and maintained automated SQL reporting pipelines processing 500,000+ rows daily.
    - Built interactive Power BI dashboards used by executive management to track KPIs.
    - Optimized database queries resulting in a 35% reduction in query execution times.
    - Architected Python scripts with Pandas and NumPy for automated data cleansing.

    EDUCATION
    Bachelor of Science in Computer Science | Cairo University (2019 - 2023)
    - Grade: Very Good with Honors

    TECHNICAL SKILLS
    - Programming & Query: Python, SQL, PostgreSQL, R
    - BI & Visualization: Power BI, Tableau, Excel
    - Data Engineering: Docker, Git, ETL, Pandas, Scikit-learn
    - Soft Skills: Problem Solving, Communication, Critical Thinking

    PROJECTS & CERTIFICATIONS
    - E-Commerce Customer Segmentation Project using Machine Learning & RFM Analysis.
    - Microsoft Certified: Power BI Data Analyst Associate
    """

    cv_bytes = sample_cv_text.encode("utf-8")
    files = {
        "file": ("Ahmed_Ali_CV.txt", io.BytesIO(cv_bytes), "text/plain")
    }
    cv_res = client.post("/api/cv/upload", files=files, headers=headers)
    assert cv_res.status_code == 200, f"CV Upload failed: {cv_res.text}"
    cv_data = cv_res.json()
    print(f"  [OK] CV Parsed Document ID: {cv_data['document_id']}")
    print(f"  [OK] Total Words: {cv_data['total_words']}")
    print(f"  [OK] Detected Sections: {cv_data['detected_sections']}")
    print(f"  [OK] Extracted Skills ({cv_data['extracted_skills_count']}): {cv_data['extracted_skills']}")
    print(f"  [OK] ATS Compatibility Score: {cv_data['ats_score']}/100")
    print(f"  [OK] Structure: {cv_data['ats_diagnostics']['structure_score']}/25 | Skills: {cv_data['ats_diagnostics']['skills_score']}/40 | Impact: {cv_data['ats_diagnostics']['impact_score']}/20")
    assert cv_data["ats_score"] >= 70, f"Expected good ATS score for rich CV, got {cv_data['ats_score']}"

    # 6. Jobs Listing & Matching Engine
    print("\n[6/7] Testing Jobs Listing & Candidate Matching...")
    jobs_res = client.get("/api/jobs?limit=5")
    assert jobs_res.status_code == 200
    jobs_data = jobs_res.json()
    print(f"  [OK] Active Jobs Listed: {len(jobs_data['jobs'])} (Total in DB: {jobs_data['total_results']})")

    match_payload = {
        "candidate_skills": ["SQL", "Python", "Power BI", "Excel", "Pandas"],
        "experience_years": 2,
        "target_role": "Data Analyst",
        "preferred_locations": ["Cairo", "Giza", "Remote"]
    }
    match_res = client.post("/api/matching/match-user", json=match_payload)
    assert match_res.status_code == 200
    match_data = match_res.json()
    print(f"  [OK] Overall Career Alignment Score: {match_data['overall_career_alignment']}")
    print(f"  [OK] Total Matching Jobs Found: {match_data['total_matched_jobs']}")
    if match_data["top_recommended_jobs"]:
        top_j = match_data["top_recommended_jobs"][0]
        print(f"  [OK] Top Job Match: '{top_j['title']}' ({top_j['company_name']}) -> {top_j['match_score']}% Match Tier: {top_j['match_tier']}")
        print(f"    - Matched Skills: {top_j['matched_skills']}")
        print(f"    - Missing Skills: {top_j['missing_skills']}")

    # 7. Admin & Scraper Scheduler Controls
    print("\n[7/7] Testing Admin & System Health Endpoints...")
    status_res = client.get("/api/admin/scraper/status")
    assert status_res.status_code == 200
    print(f"  [OK] Scraper Scheduler Status: Interval={status_res.json()['interval_hours']}h, Enabled={status_res.json()['scheduler_enabled']}")

    sys_res = client.get("/api/admin/system/stats")
    assert sys_res.status_code == 200
    print(f"  [OK] System Stats: {sys_res.json()['database']}")

    print("\n==================================================")
    print("[SUCCESS] ALL PHASE 0 VERIFICATION TESTS PASSED (100%)!")
    print("==================================================")


if __name__ == "__main__":
    test_phase0_all()
