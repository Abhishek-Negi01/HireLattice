# DATABASE_DESIGN.md

# HireLattice Database Design

> Version 2.0 (Simplified Production Architecture)

## Overview

HireLattice is an AI-powered candidate ranking platform. The backend is designed around three data stores:

- **PostgreSQL** – relational/business data
- **MongoDB** – AI-generated and flexible documents
- **Qdrant** – vector embeddings for semantic search

This separation keeps business data independent from AI data while allowing fast semantic retrieval.

---

# Overall Architecture

```text
Resume
      │
      ▼
Cloudinary
      │
      ▼
Preprocessing
      │
      ▼
Gemini
      │
      ├──► MongoDB (Structured AI Profile)
      │
      └──► Embedding
                 │
                 ▼
             Qdrant
```

```text
Job Description
        │
        ▼
Gemini
        │
        ├──► MongoDB (Parsed JD)
        │
        └──► Embedding
                 │
                 ▼
             Qdrant
```

```text
Job Embedding
      │
      ▼
Qdrant Search
      │
      ▼
Top K Candidates
      │
      ▼
Hybrid Ranking
      │
      ▼
Ranking API
```

---

# PostgreSQL Schema

## recruiters

| Column     | Type            |
| ---------- | --------------- |
| id         | UUID (PK)       |
| clerk_id   | String          |
| name       | String          |
| email      | String (Unique) |
| created_at | Timestamp       |
| updated_at | Timestamp       |

---

## candidates

| Column           | Type              |
| ---------------- | ----------------- |
| id               | UUID (PK)         |
| clerk_id         | String (Nullable) |
| full_name        | String            |
| email            | String (Unique)   |
| phone            | String            |
| location         | String            |
| current_role     | String            |
| experience_years | Float             |
| created_at       | Timestamp         |
| updated_at       | Timestamp         |

Candidates may be created by:

- Self registration
- Recruiter bulk upload

---

## resumes

Metadata only.

| Column            | Type                                 |
| ----------------- | ------------------------------------ |
| id                | UUID                                 |
| candidate_id      | FK                                   |
| file_name         | String                               |
| cloudinary_url    | String                               |
| file_type         | PDF/DOCX                             |
| version           | Integer                              |
| upload_source     | candidate/recruiter                  |
| processing_status | uploaded / parsed / indexed / failed |
| created_at        | Timestamp                            |

---

## jobs

| Column          | Type                       |
| --------------- | -------------------------- |
| id              | UUID                       |
| recruiter_id    | FK                         |
| title           | String                     |
| department      | String                     |
| description     | Text                       |
| employment_type | String                     |
| location        | String                     |
| status          | Draft / Published / Closed |
| created_at      | Timestamp                  |

AI-parsed job details are stored in MongoDB.

---

## applications (Optional)

Only required if candidates can apply through the platform.

| Column       | Type                |
| ------------ | ------------------- |
| id           | UUID                |
| candidate_id | FK                  |
| job_id       | FK                  |
| status       | Applied / Withdrawn |
| created_at   | Timestamp           |

---

## rankings

Stores generated rankings for a job.

| Column           | Type      |
| ---------------- | --------- |
| id               | UUID      |
| job_id           | FK        |
| candidate_id     | FK        |
| semantic_score   | Float     |
| skills_score     | Float     |
| experience_score | Float     |
| behavior_score   | Float     |
| overall_score    | Float     |
| rank             | Integer   |
| reasoning        | Text      |
| generated_at     | Timestamp |

---

# PostgreSQL Relationships

recruiter
└── jobs

candidate
└── resumes

job
└── rankings

candidate
└── rankings

(optional)

candidate
└── applications
└── jobs

---

# MongoDB Collections

## candidate_ai_profiles

```json
{
  "candidateId": "...",
  "rawResumeText": "...",
  "parsedResume": {},
  "summary": "...",
  "skills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "certifications": [],
  "languages": [],
  "behaviorSignals": {},
  "featureVector": {},
  "embeddingStatus": "completed",
  "updatedAt": ""
}
```

---

## job_ai_profiles

```json
{
  "jobId": "...",
  "parsedJD": {},
  "requiredSkills": [],
  "preferredSkills": [],
  "responsibilities": [],
  "minimumExperience": 2,
  "education": [],
  "summary": "",
  "embeddingStatus": "completed"
}
```

---

## preprocessing_logs

```json
{
  "resumeId": "...",
  "stage": "normalization",
  "status": "success",
  "message": "",
  "processingTime": 2300,
  "createdAt": ""
}
```

---

# Qdrant

## candidate_embeddings

Payload

```json
{
  "candidateId": "...",
  "experience": 4,
  "skills": ["React", "Node", "MongoDB"],
  "location": "Delhi"
}
```

Vector

- 768 or model default dimensions

---

## job_embeddings

Payload

```json
{
  "jobId": "...",
  "requiredSkills": ["React", "Node"]
}
```

---

# Resume Preprocessing Pipeline

```
Upload

↓

Validation

↓

PDF/DOCX Extraction

↓

OCR (if scanned)

↓

Text Cleaning

↓

Skill Normalization

↓

Company Normalization

↓

Date Normalization

↓

Duplicate Detection

↓

Gemini Parsing

↓

Groq Fallback

↓

Structured JSON

↓

MongoDB

↓

Embedding Generation

↓

Qdrant
```

---

# Bulk Resume Upload

Supported

- Multiple PDFs
- Multiple DOCX
- ZIP

Workflow

```
Upload ZIP

↓

Extract Files

↓

Validate

↓

Parallel Processing

↓

Preprocess

↓

AI Parse

↓

Embedding

↓

Store

↓

Return Upload Report
```

Upload report should include:

- Total Files
- Successful
- Failed
- Duplicate
- Processing Time

---

# Hybrid Ranking Formula

Overall Score =

35% Semantic Similarity

25% Skill Match

15% Experience

10% Behavioral Signals

10% Resume Quality

5% Education

---

# Required Indexes

## PostgreSQL

- recruiter.email
- candidate.email
- resume.candidate_id
- ranking.job_id
- ranking.candidate_id

## MongoDB

- candidateId
- jobId
- skills
- experience.company
- projects.techStack

## Qdrant

Payload Index

- candidateId
- skills
- location
- experience

---

# Edge Cases

- Corrupted PDF
- Password Protected PDF
- Empty Resume
- Image-only Resume
- Duplicate Resume
- Duplicate Candidate
- Large ZIP Upload
- AI Timeout
- Invalid AI JSON
- Embedding Failure
- MongoDB Failure
- Qdrant Failure

---

# Future Scalability

Future enhancements can be added without redesign:

- Multi-company support
- Multi-recruiter organizations
- Interview management
- AI interview assistant
- Referral system
- Analytics dashboard
