interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    fileName?: string;
    createdAt: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface KeywordMatch {
    keyword: string;
    matched: boolean;
}

interface SkillGapItem {
    skill: string;
    status: "present" | "missing";
}

interface Feedback {
    overallScore: number;
    resumeScore: number;
    ATS: {
        score: number;
        matchedKeywords: string[];
        missingKeywords: string[];
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    keywordMatches: KeywordMatch[];
    skillGap: {
        present: string[];
        missing: string[];
        recommendations: string[];
        items: SkillGapItem[];
    };
    interviewQuestions: string[];
    improvementTips: string[];
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}
