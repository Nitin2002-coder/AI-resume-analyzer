import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="card-title">{companyName}</h2>}
                    {jobTitle && <h3 className="muted-text">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="card-title">Resume Review</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {imagePath && (
                <div className="preview-frame animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={imagePath}
                            alt="resume"
                            className="w-full h-[330px] max-sm:h-[220px] object-cover object-top rounded-lg"
                        />
                    </div>
                </div>
                )}
        </Link>
    )
}
export default ResumeCard
