import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import Footer from "~/components/layout/Footer";
import {useNavigate} from "react-router";
import {convertPdfToImage, extractPdfText} from "~/lib/pdf2img";
import {fileToDataUrl, generateUUID} from "~/lib/utils";
import {resumeStore} from "~/lib/resumeStore";
import {analyzeResume} from "~/lib/resumeAnalyzer";

const Upload = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Reading resume content...');
        const resumeText = await extractPdfText(file);

        setStatusText('Creating resume preview...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Preparing local analysis...');
        const resumePath = await fileToDataUrl(file);
        const imagePath = await fileToDataUrl(imageFile.file);

        setStatusText('Analyzing ATS fit and skill gaps...');
        const uuid = generateUUID();
        const data: Resume = {
            id: uuid,
            resumePath,
            imagePath,
            companyName,
            jobTitle,
            jobDescription,
            fileName: file.name,
            createdAt: new Date().toISOString(),
            feedback: analyzeResume({ resumeText, jobTitle, jobDescription }),
        };

        resumeStore.save(data);
        setStatusText('Analysis complete, redirecting...');
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="app-shell">
            <Navbar />

            <section className="main-section">
                <div className="upload-layout">
                    <div className="upload-copy">
                        <p className="eyebrow">Portfolio-ready resume intelligence</p>
                        <h1>Upload once. Get a recruiter-style action plan.</h1>
                        <h2>CareerLens checks ATS keywords, resume score, skill gaps, interview questions, and practical improvement tips.</h2>
                    </div>
                    {isProcessing ? (
                        <div className="processing-card">
                            <div className="loader-ring" />
                            <h2>{statusText}</h2>
                            <p>Scanning structure, keywords, skills, and interview signals.</p>
                        </div>
                    ) : (
                    <div className="form-card">
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                    </div>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    )
}
export default Upload
