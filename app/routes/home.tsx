import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import Footer from "~/components/layout/Footer";
import {resumeStore} from "~/lib/resumeStore";
import {Link} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CareerLens Resume Studio" },
    { name: "description", content: "Portfolio-ready resume analysis with ATS insights." },
  ];
}

export default function Home() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    setResumes(resumeStore.all());
  }, []);

  return <main className="app-shell">
    <Navbar />

    <section className="main-section">
      <div className="hero-panel page-heading">
        <p className="eyebrow">No login. No setup. Just upload and improve.</p>
        <h1>CareerLens Resume Studio</h1>
        {resumes?.length === 0 ? (
            <h2>Analyze your resume for ATS fit, keyword coverage, skill gaps, and interview prep in one clean dashboard.</h2>
        ): (
          <h2>Review your saved resume analyses and continue refining your applications.</h2>
        )}
        <div className="hero-actions">
          <Link to="/upload" className="primary-button w-fit text-base font-semibold">
            Analyze Resume
          </Link>
          <span className="hero-stat">{resumes.length} saved {resumes.length === 1 ? "resume" : "resumes"}</span>
        </div>
      </div>

      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => <ResumeCard key={resume.id} resume={resume} />)}
        </div>
      )}
    </section>
    <Footer />
  </main>
}
