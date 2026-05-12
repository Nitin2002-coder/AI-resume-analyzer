const CORE_SKILLS = [
  "react", "typescript", "javascript", "node", "express", "next.js", "html",
  "css", "tailwind", "python", "java", "sql", "mongodb", "postgresql", "aws",
  "docker", "git", "api", "testing", "figma", "redux", "communication",
  "leadership", "problem solving", "data analysis", "machine learning",
];

const SECTION_WORDS = ["experience", "education", "projects", "skills", "summary"];
const ACTION_WORDS = ["built", "created", "improved", "optimized", "led", "launched", "reduced", "increased", "designed", "developed"];

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const includesTerm = (text: string, term: string) =>
  new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);

const unique = (items: string[]) => [...new Set(items.map((item) => item.toLowerCase().trim()).filter(Boolean))];

function getJobKeywords(jobDescription: string, jobTitle: string) {
  const jobText = `${jobTitle} ${jobDescription}`.toLowerCase();
  const skillMatches = CORE_SKILLS.filter((skill) => includesTerm(jobText, skill));
  const wordMatches = unique(jobText.match(/\b[a-z][a-z+#.]{2,}\b/g) || [])
    .filter((word) => !["and", "the", "for", "with", "you", "our", "are", "from", "this", "that", "will", "job", "role"].includes(word))
    .slice(0, 10);

  return unique([...skillMatches, ...wordMatches]).slice(0, 14);
}

const makeTips = (score: number, good: string, improve: string, explanation: string) => ({
  score,
  tips: [
    {
      type: score >= 70 ? "good" : "improve",
      tip: score >= 70 ? good : improve,
      explanation,
    },
  ] as { type: "good" | "improve"; tip: string; explanation: string }[],
});

export function analyzeResume({
  resumeText,
  jobTitle,
  jobDescription,
}: {
  resumeText: string;
  jobTitle: string;
  jobDescription: string;
}): Feedback {
  const text = resumeText.toLowerCase();
  const words = text.match(/\b[a-z0-9+#.]+\b/g) || [];
  const wordCount = words.length;
  const jobKeywords = getJobKeywords(jobDescription, jobTitle);
  const fallbackKeywords = CORE_SKILLS.slice(0, 10);
  const targetKeywords = jobKeywords.length ? jobKeywords : fallbackKeywords;
  const matchedKeywords = targetKeywords.filter((keyword) => includesTerm(text, keyword));
  const missingKeywords = targetKeywords.filter((keyword) => !includesTerm(text, keyword));
  const presentSkills = CORE_SKILLS.filter((skill) => includesTerm(text, skill));
  const missingSkills = CORE_SKILLS
    .filter((skill) => targetKeywords.includes(skill) && !presentSkills.includes(skill))
    .slice(0, 6);
  const sectionsFound = SECTION_WORDS.filter((section) => includesTerm(text, section)).length;
  const actionWordsFound = ACTION_WORDS.filter((word) => includesTerm(text, word)).length;
  const hasMetrics = /\b\d+%|\$\d+|\b\d+\s*(users|clients|projects|apps|teams|months|years)\b/i.test(resumeText);

  const atsScore = clamp(45 + (matchedKeywords.length / targetKeywords.length) * 35 + sectionsFound * 4);
  const contentScore = clamp(35 + Math.min(wordCount / 8, 30) + actionWordsFound * 4 + (hasMetrics ? 15 : 0));
  const structureScore = clamp(45 + sectionsFound * 9 + (wordCount > 250 ? 10 : 0));
  const skillsScore = clamp(35 + Math.min(presentSkills.length * 7, 45) + (missingSkills.length ? 0 : 10));
  const toneScore = clamp(50 + actionWordsFound * 5 + (hasMetrics ? 10 : 0));
  const overallScore = clamp((atsScore + contentScore + structureScore + skillsScore + toneScore) / 5);

  const improvementTips = [
    hasMetrics ? "Keep the measurable achievements visible near the top of each role." : "Add measurable outcomes such as percentages, scale, revenue, users, or time saved.",
    missingKeywords.length ? `Add role-specific keywords naturally: ${missingKeywords.slice(0, 5).join(", ")}.` : "Your target keywords are well represented. Keep them readable and contextual.",
    sectionsFound < SECTION_WORDS.length ? "Use clear section headings for Summary, Skills, Experience, Projects, and Education." : "The resume structure is easy for recruiters and ATS tools to scan.",
    actionWordsFound < 4 ? "Start bullets with stronger action verbs like built, optimized, led, launched, and improved." : "Action verbs are helping your experience sound active and ownership-driven.",
  ];

  return {
    overallScore,
    resumeScore: overallScore,
    ATS: {
      score: atsScore,
      matchedKeywords,
      missingKeywords,
      tips: [
        { type: matchedKeywords.length >= targetKeywords.length / 2 ? "good" : "improve", tip: `${matchedKeywords.length} of ${targetKeywords.length} target keywords matched.` },
        { type: sectionsFound >= 4 ? "good" : "improve", tip: sectionsFound >= 4 ? "Core resume sections are easy to detect." : "Add standard section headings for better ATS parsing." },
        { type: missingKeywords.length <= 3 ? "good" : "improve", tip: missingKeywords.length <= 3 ? "Keyword coverage is focused." : `Missing: ${missingKeywords.slice(0, 5).join(", ")}.` },
      ],
    },
    keywordMatches: targetKeywords.map((keyword) => ({
      keyword,
      matched: matchedKeywords.includes(keyword),
    })),
    skillGap: {
      present: presentSkills,
      missing: missingSkills,
      recommendations: missingSkills.length
        ? missingSkills.map((skill) => `Build or describe one project that demonstrates ${skill}.`)
        : ["Your listed skills align well with the target role. Add project proof for your strongest skills."],
      items: targetKeywords
        .filter((keyword) => CORE_SKILLS.includes(keyword))
        .map((skill) => ({ skill, status: presentSkills.includes(skill) ? "present" : "missing" })),
    },
    interviewQuestions: presentSkills.slice(0, 5).map((skill) => `Tell me about a project where you used ${skill} and what result it created.`)
      .concat([
        `How would you explain your fit for a ${jobTitle || "target"} role in 60 seconds?`,
        "Which resume project best shows ownership, tradeoffs, and measurable impact?",
      ]).slice(0, 6),
    improvementTips,
    toneAndStyle: makeTips(toneScore, "Confident professional tone", "Strengthen ownership language", "Use active verbs and concise bullets so your impact is clear quickly."),
    content: makeTips(contentScore, "Impact is visible", "Add stronger achievements", "Recruiters look for proof: scope, tools, metrics, and outcomes."),
    structure: makeTips(structureScore, "ATS-friendly structure", "Improve section clarity", "Standard headings and clean ordering make the resume easier to scan."),
    skills: makeTips(skillsScore, "Relevant skills detected", "Close skill gaps", "Match the skills section to the target role and support key skills in project bullets."),
  };
}
