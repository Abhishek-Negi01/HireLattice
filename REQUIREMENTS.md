# HireLattice Requirements Specification

> Version: 1.0

---

# Table of Contents

- Project Goal
- Stakeholders
- Functional Requirements
- Non-Functional Requirements
- AI Requirements
- Resume Processing Requirements
- Database Requirements
- Security Requirements
- Performance Requirements
- External Services
- Tech Stack
- APIs
- Constraints
- Assumptions
- Future Scope

---

# 1. Project Goal

HireLattice is an AI-powered recruitment platform designed to help recruiters identify the best candidates using semantic understanding instead of keyword matching.

The system should:

- Understand Job Descriptions
- Understand Candidate Resumes
- Compare candidates semantically
- Rank candidates intelligently
- Explain every recommendation
- Handle bulk resume uploads efficiently

---

# 2. Stakeholders

## Recruiter

Responsibilities

- Login
- Create Job Posts
- Upload Resumes
- Upload Bulk Resume Dataset
- Search Candidates
- View AI Rankings
- Schedule Interviews
- Give Feedback
- Track Hiring

---

## Candidate

Responsibilities

- Register
- Upload Resume
- Maintain Profile
- Apply to Jobs
- Track Application
- Attend Interviews

---

# 3. Functional Requirements

---

## Authentication Module

Recruiter

- Login
- Logout
- Session Management

Candidate

- Signup
- Login
- Logout
- Password Recovery (handled by Clerk)

---

## Company Module

The application is company-centric.

Features

- Company Profile
- Recruiter Management
- Departments
- Hiring Teams

---

## Job Module

Recruiter should be able to

- Create Job
- Edit Job
- Delete Job
- Close Job
- Archive Job

AI should

- Parse JD
- Extract Skills
- Extract Responsibilities
- Extract Experience
- Generate Embedding

---

## Resume Module

Candidate

- Upload Resume
- Replace Resume
- View Resume
- Delete Resume

Recruiter

- Upload Single Resume
- Upload Multiple Resumes
- Upload ZIP
- Upload Dataset

Supported Formats

- PDF
- DOCX
- ZIP

---

## Resume Preprocessing

System should

- Extract Text
- OCR scanned PDFs
- Remove Noise
- Normalize Skills
- Normalize Companies
- Normalize Dates
- Remove Duplicate Spaces
- Remove Invalid Characters
- Detect Language
- Validate File

---

## Duplicate Detection

System must detect

- Same Resume
- Same Candidate
- Same Email
- Same Phone
- Same LinkedIn
- Resume Hash
- Semantic Duplicate

---

## Resume Intelligence

AI should extract

- Skills
- Projects
- Experience
- Education
- Certifications
- Languages
- Career Timeline
- Leadership
- Responsibilities

Generate

- Structured Resume
- Resume Summary
- AI Metadata

---

## Candidate Search

Recruiter should search using

- Skills
- Experience
- Company
- Education
- Location
- Notice Period
- Availability
- Salary

AI Search

- Natural Language Query
- Semantic Search

---

## Candidate Ranking

Ranking Engine should calculate

- Semantic Score
- Skill Score
- Experience Score
- Education Score
- Behavioral Score
- Resume Quality

Return

Top Ranked Candidates

---

## Recommendation Module

System should recommend

- Best Candidates
- Similar Candidates
- Hidden Gems
- Alternative Candidates

---

## Explainability Module

Every ranked candidate should contain

- Overall Score
- Strengths
- Weaknesses
- Missing Skills
- Recommendation Reason

No candidate should be ranked without explanation.

---

## Application Module

Candidate

- Apply
- Withdraw

Recruiter

- Accept
- Reject
- Shortlist

---

## Interview Module

Recruiter should

- Schedule Interview
- Update Status
- Add Feedback

Candidate should

- View Interview
- Track Status

---

## Dashboard

Recruiter Dashboard

- Jobs
- Candidates
- Rankings
- Analytics
- Interviews

Candidate Dashboard

- Applications
- Resume
- Profile
- Interviews

---

# 4. Non Functional Requirements

---

## Scalability

System should support

- 10000+ Candidates
- 1000+ Jobs
- Bulk Resume Upload
- Multiple Recruiters

---

## Availability

Target

99%+

---

## Reliability

No Resume Loss

No Duplicate Candidate

No Duplicate Resume

---

## Maintainability

Feature-Based Architecture

Reusable Components

Clean APIs

---

## Extensibility

Future support

- Multiple Companies
- AI Interviews
- Referral System
- Employee Portal

without major refactoring.

---

# 5. AI Requirements

Primary Model

Gemini

Fallback

Groq

AI Tasks

- Resume Parsing
- JD Parsing
- Summary Generation
- Explanation Generation

AI should never directly rank candidates.

Ranking must use

- Embeddings
- Hybrid Scoring
- Structured Features

---

# 6. Embedding Requirements

Generate embeddings for

- Candidate Profile
- Job Description

Store

Qdrant

Search

Cosine Similarity

Top-K Retrieval

---

# 7. Resume Processing Requirements

Support

Single Upload

Bulk Upload

ZIP Upload

Folder Upload

Dataset Upload

Pipeline

Upload

↓

Validation

↓

Extraction

↓

Cleaning

↓

Normalization

↓

AI Parsing

↓

Embedding

↓

Storage

↓

Ready

---

# 8. Database Requirements

## PostgreSQL

Store

- Users
- Recruiters
- Companies
- Jobs
- Applications
- Interviews
- Rankings
- Feedback

---

## MongoDB

Store

- Parsed Resume
- Resume Summary
- AI Profile
- Feature Vector
- Logs

---

## Qdrant

Store

- Candidate Embeddings
- Job Embeddings

---

# 9. Security Requirements

Authentication

Clerk

Passwords

Managed by Clerk

Authorization

Role Based

Recruiter

Candidate

Secure APIs

Protected Routes

Input Validation

Rate Limiting

Helmet

CORS

Sanitized Inputs

Environment Variables

Never expose API Keys

---

# 10. Performance Requirements

Resume Upload

< 5 Seconds

Resume Parsing

< 30 Seconds

Semantic Search

< 1 Second

Candidate Ranking

< 3 Seconds

Job Parsing

< 10 Seconds

Bulk Upload

Process in Parallel

---

# 11. External Services

Authentication

- Clerk

AI

- Gemini
- Groq

Storage

- Cloudinary

SQL

- Neon PostgreSQL

NoSQL

- MongoDB Atlas

Vector Database

- Qdrant Cloud

Deployment

- Render
- Vercel

---

# 12. Tech Stack

Frontend

- React
- Vite
- TailwindCSS
- Zustand
- Axios
- React Hook Form

Backend

- Node.js
- Express
- Prisma
- JavaScript

Libraries

- Multer
- pdf-parse
- mammoth
- zod
- cloudinary
- qdrant-js
- mongoose

---

# 13. REST APIs

Authentication

```text
/api/auth
```

Recruiter

```text
/api/recruiter
```

Candidate

```text
/api/candidate
```

Company

```text
/api/company
```

Jobs

```text
/api/jobs
```

Resume

```text
/api/resume
```

AI

```text
/api/ai
```

Ranking

```text
/api/ranking
```

Recommendation

```text
/api/recommendation
```

Interview

```text
/api/interview
```

Search

```text
/api/search
```

---

# 14. Constraints

- JavaScript Backend
- Express Framework
- Company-centric architecture
- Free-tier cloud services
- Gemini as primary AI
- Groq as fallback
- PostgreSQL + MongoDB + Qdrant
- Feature-based architecture
- Semantic search instead of keyword matching
- Bulk resume upload support
- AI-assisted preprocessing before indexing

---

# 15. Assumptions

- One company uses the platform.
- Recruiters belong to that company.
- Candidates can apply to multiple jobs.
- One candidate can maintain multiple resume versions.
- AI preprocessing occurs before ranking.
- Embeddings are generated once and reused.

---

# 16. Future Scope

- Multi-company SaaS
- AI Interview Assistant
- Resume Improvement Suggestions
- Recruiter Copilot
- Candidate Skill Gap Analysis
- Salary Prediction
- Employee Referral System
- Internal Hiring
- Calendar Integration
- Email Automation
- Real-time Notifications

---

# Acceptance Criteria

The project is considered complete when:

- Recruiters can create jobs and upload resumes.
- Candidates can register and apply.
- AI successfully parses resumes and job descriptions.
- Embeddings are generated and indexed.
- Semantic search retrieves relevant candidates.
- Hybrid ranking produces explainable results.
- Bulk uploads are processed with validation and duplicate detection.
- Recruiters can manage interviews and hiring decisions through a single platform.
