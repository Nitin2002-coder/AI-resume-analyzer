interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const subtitle = score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

  return (
    <div className="analysis-card ats-card">
      <div className="flex items-center gap-4 mb-6">
        <div className="metric-icon">ATS</div>
        <div>
          <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2>
          <p className="muted-text">{subtitle}</p>
        </div>
      </div>

      <p className="muted-text mb-4">
        This score estimates how clearly your resume can be parsed and matched against the target role.
      </p>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={`${suggestion.tip}-${index}`} className="flex items-start gap-3">
            <span className={suggestion.type === "good" ? "status-dot good" : "status-dot improve"} />
            <p className={suggestion.type === "good" ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"}>
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATS;
