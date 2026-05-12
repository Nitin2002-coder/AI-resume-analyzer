import {cn} from "~/lib/utils";

const Section = ({title, children}: { title: string; children: React.ReactNode }) => (
    <section className="insight-panel">
        <h3>{title}</h3>
        {children}
    </section>
);

const InsightSections = ({feedback}: { feedback: Feedback }) => {
    return (
        <div className="insight-grid">
            <Section title="ATS Keyword Matching">
                <div className="keyword-cloud">
                    {feedback.keywordMatches.map((item) => (
                        <span key={item.keyword} className={cn("keyword-pill", item.matched ? "matched" : "missing")}>
                            {item.keyword}
                        </span>
                    ))}
                </div>
            </Section>

            <Section title="Skill Gap Analysis">
                <div className="skill-columns">
                    <div>
                        <p className="mini-label">Present</p>
                        <ul>{(feedback.skillGap.present.length ? feedback.skillGap.present : ["Add more technical skills"]).map((skill) => <li key={skill}>{skill}</li>)}</ul>
                    </div>
                    <div>
                        <p className="mini-label">To Improve</p>
                        <ul>{(feedback.skillGap.missing.length ? feedback.skillGap.missing : ["No major target gaps"]).map((skill) => <li key={skill}>{skill}</li>)}</ul>
                    </div>
                </div>
            </Section>

            <Section title="Interview Question Suggestions">
                <ul className="numbered-list">
                    {feedback.interviewQuestions.map((question) => <li key={question}>{question}</li>)}
                </ul>
            </Section>

            <Section title="Resume Improvement Tips">
                <ul className="tip-list">
                    {feedback.improvementTips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
            </Section>
        </div>
    );
};

export default InsightSections;
