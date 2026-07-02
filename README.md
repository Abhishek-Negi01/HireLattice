# README.md

# HireLattice
Video Presentation Drive Link - https://drive.google.com/drive/folders/1HCc0T1zv1jQ2E9HMJxVtAgzVIdmsr-DR?usp=sharing

### AI-Powered Candidate Intelligence & Recruitment Platform

> **HireLattice** is an enterprise-grade AI recruitment platform that helps recruiters discover, rank, and evaluate candidates based on semantic understanding rather than keyword matching. It combines Large Language Models, Vector Search, Hybrid Ranking, and Behavioral Intelligence to produce explainable hiring recommendations.

---

# Table of Contents

- Overview
- Problem Statement
- Solution
- Key Features
- System Architecture
- AI Pipeline
- Recruiter Workflow
- Candidate Workflow
- Resume Processing Pipeline
- Tech Stack
- Folder Structure
- Installation
- Environment Variables
- Running the Project
- Deployment
- Future Scope
- Team

---

# Overview

Traditional Applicant Tracking Systems (ATS) rely heavily on keyword matching. As a result, highly qualified candidates are frequently overlooked because their resumes don't contain the exact terms recruiters search for.

HireLattice replaces keyword matching with semantic understanding.

Instead of asking:

> Does the resume contain "LangChain"?

It asks:

> Does this candidate have experience building retrieval systems, vector search, embeddings, and LLM applications even if LangChain isn't mentioned?

The platform uses AI to understand both Job Descriptions and Candidate Profiles, then ranks candidates using multiple signals including:

- Semantic similarity
- Skills
- Career progression
- Experience
- Education
- Behavioral signals
- Resume quality
- Recruiter engagement
- Explainable AI reasoning

---

# Problem Statement

Recruiters often receive hundreds or thousands of resumes for a single position.

Common ATS systems:

- rely on keyword search
- ignore context
- cannot understand transferable skills
- rank candidates incorrectly
- provide no explanation for rankings

The result is:

- false positives
- false negatives
- wasted recruiter time
- missed talent

HireLattice solves this using semantic AI.

---

# Solution

HireLattice introduces a complete AI-powered recruitment pipeline.

Instead of

Resume

↓

Keyword Matching

↓

Candidate List

We perform

Resume

↓

AI Resume Understanding

↓

Structured Candidate Profile

↓

Embedding Generation

↓

Vector Database

↓

Semantic Search

↓

Hybrid Ranking

↓

AI Explainability

↓

Recruiter Dashboard

The result is a recruiter-friendly shortlist with transparent reasoning.

---

# Core Features

## Recruiter

- Secure Authentication
- Create Job Posts
- AI Job Description Analysis
- Bulk Resume Upload
- Individual Resume Upload
- Candidate Search
- Semantic Candidate Search
- Hybrid AI Ranking
- Resume Viewer
- Candidate Shortlisting
- AI Ranking Explanation

---

## Candidate

- Authentication
- Profile Management
- Resume Upload
- Resume Parsing
- AI Generated Profile
- Resume History
- Job Applications

---

## AI Features

- Resume Parsing
- Job Description Understanding
- Skill Extraction
- Experience Extraction
- Project Understanding
- Education Extraction
- Career Timeline Analysis
- Skill Normalization
- Embedding Generation
- Semantic Matching
- Hybrid Ranking
- AI Recommendations
- Explainable Ranking

---

# System Architecture

```text
                        React Frontend
                               │
──────────────────────────────────────────────────

                    Express REST API

──────────────────────────────────────────────────

Authentication

Candidate

Recruiter

Job

Resume

Search

Ranking

──────────────────────────────────────────────────

AI Layer

Resume Intelligence

↓

Job Intelligence

↓

Embedding Engine

↓

Matching Engine

↓

Ranking Engine

↓

Explanation Engine

──────────────────────────────────────────────────

PostgreSQL

MongoDB

Qdrant

──────────────────────────────────────────────────

Gemini API

↓

Groq API (Fallback)
```

---

# AI Pipeline

## Resume Processing

Resume Upload

↓

PDF/DOCX Extraction

↓

OCR (if required)

↓

Cleaning

↓

Normalization

↓

Duplicate Detection

↓

Gemini

↓

Groq (Fallback)

↓

Structured Resume

↓

Embedding

↓

MongoDB

↓

Qdrant

↓

Candidate Ready

---

## Job Processing

Recruiter Creates Job

↓

AI understands Job Description

↓

Extract

- Skills
- Experience
- Responsibilities
- Preferred Skills
- Soft Skills

↓

Embedding Generation

↓

Store

↓

Ready for Matching

---

## Matching Pipeline

Job Embedding

↓

Vector Search

↓

Top Candidates

↓

Hybrid Scoring

↓

AI Explanation

↓

Recruiter Dashboard

---

# Resume Preprocessing Pipeline

The platform supports both

- Single Resume Upload
- Bulk Resume Upload

Bulk Upload Supports

- ZIP Files
- Multiple PDFs
- DOCX Files

Pipeline

Upload

↓

Extract

↓

Validate

↓

Duplicate Detection

↓

Language Detection

↓

Resume Cleaning

↓

Skill Standardization

↓

Date Normalization

↓

Company Normalization

↓

AI Parsing

↓

Embedding Generation

↓

Storage

This pipeline ensures consistent ranking regardless of resume format.

---

# Hybrid Ranking

Candidate scores are calculated using multiple factors.

## Semantic Match

Measures similarity between the Job Description and Candidate Profile.

Weight

35%

---

## Skills Match

Required Skills

Preferred Skills

Missing Skills

Weight

25%

---

## Experience

Years

Role Similarity

Career Growth

Weight

15%

---

## Education

Degree

Field

Institution

Weight

5%

---

## Behavioral Signals

Recruiter Response Rate

Interview Completion

Profile Activity

Availability

Notice Period

Weight

10%

---

## Resume Quality

Profile Completeness

Project Quality

Certifications

Weight

10%

---

# Recruiter Workflow

Recruiter Login

↓

Create Job

↓

AI Understands JD

↓

Publish Job

↓

Upload Candidate Resumes

↓

AI Parses Resumes

↓

Semantic Matching

↓

Hybrid Ranking

↓

Candidate Recommendations

↓

Shortlist

↓

Hiring

---

# Candidate Workflow

Candidate Signup

↓

Complete Profile

↓

Upload Resume

↓

Resume Parsing

↓

Candidate Profile Generated

↓

Apply for Jobs

---

# Technology Stack

## Frontend

- React
- Vite
- TailwindCSS
- Zustand
- React Router
- React Hook Form
- Axios
- Zod

---

## Backend

- Node.js
- Express.js
- JavaScript
- Prisma ORM

---

## AI

Primary

Gemini API

Fallback

Groq API

---

## Database

PostgreSQL (Neon)

MongoDB Atlas

Qdrant Vector Database

---

## Authentication

Clerk

---

## Storage

Cloudinary

---

## Deployment

Frontend

Vercel

Backend

Render

Databases

MongoDB Atlas

Neon

Qdrant Cloud

---

# Project Structure

```text
HireLattice/

backend/

frontend/

docs/

README.md

REQUIREMENTS.md

.env.example
```

A detailed backend folder structure is provided separately.

---

# Installation

Clone

```bash
git clone <repository-url>
```

Backend

```bash
cd backend

npm install
```

Frontend

```bash
cd frontend

npm install
```

---

# Environment Variables

Backend

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=

MONGODB_URI=

QDRANT_URL=

QDRANT_API_KEY=

CLERK_SECRET_KEY=

CLERK_PUBLISHABLE_KEY=

GEMINI_API_KEY=

GROQ_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Frontend

```env
VITE_API_URL=

VITE_CLERK_PUBLISHABLE_KEY=
```

---

# Running

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

# Future Enhancements

- Multi-company support
- AI Interview Assistant
- Resume Improvement Suggestions
- Salary Prediction
- Career Path Prediction
- Candidate Skill Gap Analysis
- Automated Interview Question Generation
- Recruiter Copilot
- Hiring Analytics Dashboard
- Multi-language Resume Support

---

# Why HireLattice?

Unlike traditional ATS platforms,

HireLattice:

- Understands resumes instead of matching keywords.
- Uses semantic embeddings for intelligent retrieval.
- Ranks candidates using multiple dimensions rather than a single similarity score.
- Explains every recommendation to recruiters.
- Supports bulk resume ingestion with preprocessing.
- Is designed around scalable AI-assisted hiring workflows.

---

# Team

Developed as an AI-powered intelligent recruitment platform using modern web technologies, Large Language Models, semantic search, and hybrid ranking techniques.
