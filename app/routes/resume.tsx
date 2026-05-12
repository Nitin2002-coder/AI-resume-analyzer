import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";
import Footer from "~/components/layout/Footer";
import InsightSections from "~/components/analysis/InsightSections";
import {resumeStore} from "~/lib/resumeStore";

export const meta = () => ([
    { title: 'CareerLens | Resume Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { id } = useParams();
    const [resume, setResume] = useState<Resume | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        const data = resumeStore.get(id);
        if (!data) {
            navigate("/");
            return;
        }
        setResume(data);
        setFeedback(data.feedback);
    }, [id]);

    return (
        <main className="app-shell !pt-0">
            <Navbar />
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <span>&lt;</span>
                    <span>Back to dashboard</span>
                </Link>
            </nav>
            <div className="review-layout">
                <section className="preview-section">
                    {resume && (
                        <div className="resume-preview animate-in fade-in duration-700">
                            <a href={resume.resumePath} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={resume.imagePath}
                                    className="w-full h-full object-contain rounded-xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <div>
                        <p className="eyebrow">Analysis dashboard</p>
                        <h2 className="section-title">Resume Review</h2>
                        {resume?.jobTitle && <p className="muted-text">{resume.jobTitle}{resume.companyName ? ` at ${resume.companyName}` : ""}</p>}
                    </div>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <InsightSections feedback={feedback} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="processing-card"><div className="loader-ring" /><p>Loading analysis...</p></div>
                    )}
                </section>
            </div>
            <Footer />
        </main>
    )
}
export default Resume
