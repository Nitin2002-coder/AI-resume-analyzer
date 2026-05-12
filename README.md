# CareerLens Resume Studio

A modern, login-free resume analyzer built for portfolio demonstrations and interview explanations. Upload a PDF resume, add a target role, and get a local browser-based analysis with resume score, ATS keyword matching, skill gap analysis, interview question suggestions, and improvement tips.

## Features

- Opens directly without authentication
- PDF drag-and-drop upload with animated states
- Resume preview generated from the first PDF page
- Resume Score and ATS Score dashboards
- ATS keyword matching from the target job description
- Skill Gap Analysis for present and missing role skills
- Interview Question Suggestions based on detected skills
- Resume Improvement Tips with beginner-friendly scoring logic
- Dark mode toggle with saved preference
- Responsive layout for mobile, laptop, and desktop screens
- Local browser storage for saved resume reviews

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Vite
- Tailwind CSS 4
- PDF.js
- React Dropzone
- LocalStorage

## Run Locally

```bash
npm install
npm run dev
```

## Portfolio Notes

CareerLens is intentionally designed without external auth or paid AI keys, which makes it easy to run during demos. The analysis logic is transparent in `app/lib/resumeAnalyzer.ts`, so it is simple to explain in interviews and can later be connected to an AI API if needed.
