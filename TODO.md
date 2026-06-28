# TODO.md

# HireLattice Backend Development Roadmap (2 Days)

> **Project:** HireLattice – AI-Powered Candidate Intelligence & Semantic Recruitment Platform

> **Owner:** Backend Developer

> **Scope:** Backend Only (Frontend is developed independently)

---

# Goal

Build a production-ready backend capable of:

- Receiving Job Descriptions
- Receiving Single/Bulk Candidate Resumes
- Preprocessing Resume Data
- Understanding Resume & JD using AI
- Generating Embeddings
- Storing Structured Data
- Performing Semantic Search
- Ranking Candidates
- Returning Explainable Recommendations

---

# Success Criteria

The backend is complete when it can:

- Authenticate Recruiters and Candidates
- Upload single or bulk resumes
- Parse resumes into structured data
- Parse job descriptions
- Generate embeddings
- Store structured data in MongoDB
- Store vectors in Qdrant
- Store business data in PostgreSQL
- Perform semantic retrieval
- Rank candidates using hybrid scoring
- Return explainable rankings via APIs
- Deploy successfully

---

# DAY 1 — Infrastructure & AI Ingestion Pipeline

---

# Phase 1 — Project Initialization

## Project Setup

- Initialize Express.js project
- Configure Feature-Based Architecture
- Setup Environment Variables
- Configure ESLint
- Configure Prettier
- Configure Path Aliases
- Global Error Handler
- API Response Wrapper
- Logging Utility
- Health Check API

---

# Phase 2 — Database Setup

## PostgreSQL (Neon)

- Configure Prisma
- Generate Prisma Client
- Create Initial Migration

Create Tables

- Company
- Recruiter
- Candidate
- Resume
- Job
- JobSkill
- Application
- Ranking
- Interview
- Feedback

---

## MongoDB

Create Collections

- candidate_ai_profiles
- job_ai_profiles
- preprocessing_logs
- duplicate_candidates

Configure

- Connection
- Validation
- Indexes

---

## Qdrant

- Create candidate_embeddings collection
- Create job_embeddings collection
- Configure SDK
- Test Insert
- Test Search

---

# Phase 3 — Authentication

Implement

- Clerk Middleware
- Recruiter Authentication
- Candidate Authentication
- Protected Routes
- Role Validation

---

# Phase 4 — Resume Upload APIs

## Candidate Upload

Create API

```text
POST /api/resume/upload
```

Features

- Upload PDF
- Upload DOCX
- Replace Resume
- Resume Versioning

---

## Recruiter Upload

Create APIs

```text
POST /api/resume/upload-single

POST /api/resume/upload-bulk

POST /api/resume/upload-zip
```

Support

- Single Resume
- Multiple Resumes
- ZIP Archive

---

# Phase 5 — Resume Preprocessing Pipeline

Build preprocessing service.

Pipeline

```text
Upload

↓

Validation

↓

Extract Text

↓

OCR Detection

↓

Cleaning

↓

Normalization

↓

Duplicate Detection

↓

Ready for AI
```

---

### Validation

- File Size
- MIME Type
- Empty File
- Password Protected PDF
- Corrupted File

---

### Text Extraction

Implement

- PDF Parser
- DOCX Parser
- OCR Interface

---

### Cleaning

- Remove Empty Lines
- Remove Special Characters
- Unicode Cleanup
- HTML Cleanup
- Extra Spaces
- Duplicate Sections

---

### Data Normalization

Normalize

- Skills
- Company Names
- Date Formats
- Degree Names
- Technologies
- Locations

Example

```text
NodeJS

↓

Node.js

↓

Node
```

---

### Duplicate Detection

Check

- Email
- Phone
- LinkedIn
- Resume Hash
- Candidate Exists

Store duplicate logs.

---

# Phase 6 — Resume Intelligence

Implement AI Resume Parser.

Primary

Gemini

Fallback

Groq

Extract

- Personal Details
- Skills
- Experience
- Education
- Certifications
- Projects
- Languages
- Career Timeline
- AI Summary

Validate JSON response.

Store

MongoDB

---

# Phase 7 — Candidate Embedding Pipeline

Generate

Candidate Embedding

Store

Qdrant

Update

MongoDB

Mark Resume Ready

---

# Phase 8 — Job Intelligence

Create APIs

```text
POST /api/jobs

PUT /api/jobs/:id

DELETE /api/jobs/:id

GET /api/jobs
```

---

AI Pipeline

Job Description

↓

Gemini

↓

Groq Fallback

↓

Extract

- Required Skills
- Preferred Skills
- Responsibilities
- Experience
- Education
- Keywords

↓

Generate Embedding

↓

MongoDB

↓

Qdrant

---

# DAY 1 Deliverables

✅ Authentication

✅ PostgreSQL Connected

✅ MongoDB Connected

✅ Qdrant Connected

✅ Resume Upload APIs

✅ Bulk Upload

✅ Resume Preprocessing

✅ Duplicate Detection

✅ Resume Parsing

✅ Candidate Embedding

✅ Job Parsing

✅ Job Embedding

---

# DAY 2 — Search, Ranking & Recommendation

---

# Phase 9 — Semantic Search Engine

Create Search APIs

```text
POST /api/search

POST /api/search/semantic
```

Pipeline

```text
Job Embedding

↓

Qdrant

↓

Top K Candidates
```

Support Filters

- Experience
- Skills
- Location
- Salary
- Notice Period
- Availability

---

# Phase 10 — Matching Engine

Implement scoring modules.

## Semantic Matching

Cosine Similarity

---

## Skill Matching

Required Skills

Preferred Skills

Missing Skills

---

## Experience Matching

- Years
- Role Similarity
- Company Relevance

---

## Education Matching

- Degree
- Branch
- Institution

---

## Behavioral Matching

Use

- Profile Completeness
- Recruiter Response Rate
- Notice Period
- Open To Work
- Interview Completion
- Activity Score

---

## Resume Quality

Calculate

- Project Quality
- Certification Count
- Skill Diversity
- Resume Completeness

---

# Phase 11 — Hybrid Ranking Engine

Formula

```text
Overall Score

=

35% Semantic

25% Skills

15% Experience

10% Behavioral

5% Education

5% Projects

5% Resume Quality
```

Store

Ranking Table

---

# Phase 12 — Recommendation Engine

Generate

- Top Candidates
- Hidden Gems
- Alternative Candidates
- Similar Candidates

Store recommendations.

---

# Phase 13 — Explainability Engine

Generate

- Why Selected
- Strengths
- Weaknesses
- Missing Skills
- Recommendation Summary

Every ranked candidate must contain explainable output.

---

# Phase 14 — Backend APIs

Recruiter APIs

- Company
- Jobs
- Search
- Ranking
- Recommendation
- Interview

Candidate APIs

- Profile
- Resume
- Applications

Shared APIs

- Health
- Upload
- AI Status

---

# Phase 15 — Testing

Test

Resume Upload

Bulk Upload

ZIP Upload

Duplicate Detection

Resume Parsing

Job Parsing

Embedding Generation

Qdrant Search

Hybrid Ranking

Recommendation

Explainability

API Validation

---

# Phase 16 — Deployment

Deploy Backend

Render

Connect

- Neon PostgreSQL
- MongoDB Atlas
- Qdrant Cloud
- Cloudinary
- Clerk
- Gemini
- Groq

Verify

- Environment Variables
- API Health
- Database Connectivity

---

# API Checklist

## Authentication

- Login
- Logout
- Protected Routes

---

## Resume

- Upload Single
- Upload Bulk
- Upload ZIP
- Get Resume
- Delete Resume

---

## Jobs

- Create
- Update
- Delete
- List
- Get Details

---

## AI

- Parse Resume
- Parse JD
- Generate Embedding

---

## Search

- Semantic Search
- Filter Search

---

## Ranking

- Generate Ranking
- Get Ranking

---

## Recommendation

- Generate Recommendations
- Retrieve Recommendations

---

## Interview

- Create
- Update
- Feedback

---

# Edge Cases

## Resume Upload

- Corrupted PDF
- Empty Resume
- Unsupported File
- Duplicate Resume
- Image-only Resume
- Password Protected PDF
- Invalid DOCX

---

## Bulk Upload

- ZIP Corruption
- Duplicate Files
- Mixed Formats
- Partial Failure
- Interrupted Upload

---

## AI

- Gemini Timeout
- Gemini Rate Limit
- Invalid JSON
- Groq Fallback Failure
- Empty AI Response

---

## Database

- PostgreSQL Failure
- MongoDB Failure
- Qdrant Failure
- Cloudinary Failure

---

## Search

- No Matching Candidates
- Empty Vector Result
- Missing Embeddings

---

# Final Deliverables

- Production-ready Express Backend
- Feature-based Architecture
- PostgreSQL Database
- MongoDB AI Storage
- Qdrant Integration
- Resume Preprocessing Pipeline
- Bulk Resume Processing
- AI Resume Intelligence
- AI Job Intelligence
- Semantic Search Engine
- Hybrid Ranking Engine
- Recommendation Engine
- Explainable AI APIs
- Backend Deployment
- API Documentation
- Complete Project Documentation

---

# Definition of Done

HireLattice backend is complete when a recruiter can create a job, upload one or thousands of resumes, the system preprocesses and structures the data, generates embeddings, retrieves candidates semantically, ranks them using hybrid scoring, and exposes all results through production-ready REST APIs without requiring any frontend-specific logic.
