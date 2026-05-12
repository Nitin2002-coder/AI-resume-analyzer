import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link, useNavigate, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("career-lens-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);
  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    window.localStorage.setItem("career-lens-theme", nextTheme ? "dark" : "light");
  };
  return /* @__PURE__ */ jsx("button", { className: "icon-button", type: "button", onClick: toggleTheme, "aria-label": "Toggle dark mode", title: "Toggle dark mode", children: /* @__PURE__ */ jsx("span", { children: isDark ? "L" : "D" }) });
};
const Navbar = () => {
  return /* @__PURE__ */ jsxs("nav", { className: "navbar", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("p", { className: "brand-mark", children: "CareerLens" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(ThemeToggle, {}),
      /* @__PURE__ */ jsx(Link, { to: "/upload", className: "primary-button w-fit", children: "Upload" })
    ] })
  ] });
};
const ScoreCircle = ({ score = 75 }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-[100px] h-[100px]", children: [
    /* @__PURE__ */ jsxs(
      "svg",
      {
        height: "100%",
        width: "100%",
        viewBox: "0 0 100 100",
        className: "transform -rotate-90",
        children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: "50",
              cy: "50",
              r: normalizedRadius,
              stroke: "#e5e7eb",
              strokeWidth: stroke,
              fill: "transparent"
            }
          ),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "grad", x1: "1", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#FF97AD" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#5171FF" })
          ] }) }),
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: "50",
              cy: "50",
              r: normalizedRadius,
              stroke: "url(#grad)",
              strokeWidth: stroke,
              fill: "transparent",
              strokeDasharray: circumference,
              strokeDashoffset,
              strokeLinecap: "round"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: `${score}/100` }) })
  ] });
};
const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }) => {
  return /* @__PURE__ */ jsxs(Link, { to: `/resume/${id}`, className: "resume-card animate-in fade-in duration-1000", children: [
    /* @__PURE__ */ jsxs("div", { className: "resume-card-header", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        companyName && /* @__PURE__ */ jsx("h2", { className: "card-title", children: companyName }),
        jobTitle && /* @__PURE__ */ jsx("h3", { className: "muted-text", children: jobTitle }),
        !companyName && !jobTitle && /* @__PURE__ */ jsx("h2", { className: "card-title", children: "Resume Review" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(ScoreCircle, { score: feedback.overallScore }) })
    ] }),
    imagePath && /* @__PURE__ */ jsx("div", { className: "preview-frame animate-in fade-in duration-1000", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: imagePath,
        alt: "resume",
        className: "w-full h-[330px] max-sm:h-[220px] object-cover object-top rounded-lg"
      }
    ) }) })
  ] });
};
const Footer = () => /* @__PURE__ */ jsx("footer", { className: "site-footer", children: /* @__PURE__ */ jsx("p", { children: "Developed by Nitin Bendwal" }) });
const STORAGE_KEY = "career-lens-resumes";
const readResumes = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeResumes = (resumes) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};
const resumeStore = {
  all: () => readResumes().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  get: (id) => readResumes().find((resume2) => resume2.id === id) || null,
  save: (resume2) => {
    const resumes = readResumes().filter((item) => item.id !== resume2.id);
    writeResumes([resume2, ...resumes]);
  },
  clear: () => writeResumes([])
};
function meta$1({}) {
  return [{
    title: "CareerLens Resume Studio"
  }, {
    name: "description",
    content: "Portfolio-ready resume analysis with ATS insights."
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  const [resumes, setResumes] = useState([]);
  useEffect(() => {
    setResumes(resumeStore.all());
  }, []);
  return /* @__PURE__ */ jsxs("main", {
    className: "app-shell",
    children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs("section", {
      className: "main-section",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "hero-panel page-heading",
        children: [/* @__PURE__ */ jsx("p", {
          className: "eyebrow",
          children: "No login. No setup. Just upload and improve."
        }), /* @__PURE__ */ jsx("h1", {
          children: "CareerLens Resume Studio"
        }), (resumes == null ? void 0 : resumes.length) === 0 ? /* @__PURE__ */ jsx("h2", {
          children: "Analyze your resume for ATS fit, keyword coverage, skill gaps, and interview prep in one clean dashboard."
        }) : /* @__PURE__ */ jsx("h2", {
          children: "Review your saved resume analyses and continue refining your applications."
        }), /* @__PURE__ */ jsxs("div", {
          className: "hero-actions",
          children: [/* @__PURE__ */ jsx(Link, {
            to: "/upload",
            className: "primary-button w-fit text-base font-semibold",
            children: "Analyze Resume"
          }), /* @__PURE__ */ jsxs("span", {
            className: "hero-stat",
            children: [resumes.length, " saved ", resumes.length === 1 ? "resume" : "resumes"]
          })]
        })]
      }), resumes.length > 0 && /* @__PURE__ */ jsx("div", {
        className: "resumes-section",
        children: resumes.map((resume2) => /* @__PURE__ */ jsx(ResumeCard, {
          resume: resume2
        }, resume2.id))
      })]
    }), /* @__PURE__ */ jsx(Footer, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
const generateUUID = () => crypto.randomUUID();
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
const FileUploader = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles2) => {
    const file2 = acceptedFiles2[0] || null;
    onFileSelect == null ? void 0 : onFileSelect(file2);
  }, [onFileSelect]);
  const maxFileSize = 20 * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize
  });
  const file = acceptedFiles[0] || null;
  return /* @__PURE__ */ jsx("div", { className: `upload-shell ${isDragActive ? "is-dragging" : ""}`, children: /* @__PURE__ */ jsxs("div", { ...getRootProps(), className: "uplader-drag-area", children: [
    /* @__PURE__ */ jsx("input", { ...getInputProps() }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 cursor-pointer", children: file ? /* @__PURE__ */ jsxs("div", { className: "uploader-selected-file", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("div", { className: "file-icon", children: "PDF" }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-800 dark:text-slate-100 truncate max-w-xs", children: file.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: formatSize(file.size) })
      ] }) }),
      /* @__PURE__ */ jsx("button", { className: "p-2 cursor-pointer", onClick: (e) => {
        e.stopPropagation();
        onFileSelect == null ? void 0 : onFileSelect(null);
      }, children: /* @__PURE__ */ jsx("span", { className: "text-xl leading-none", children: "x" }) })
    ] }) : /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "upload-orb mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { children: "^" }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-lg text-slate-600 dark:text-slate-300", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Click to upload" }),
        " or drag and drop"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: [
        "PDF only, max ",
        formatSize(maxFileSize)
      ] })
    ] }) })
  ] }) });
};
let pdfjsLib = null;
let loadPromise = null;
async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsLib = lib;
    return lib;
  });
  return loadPromise;
}
async function convertPdfToImage(file) {
  try {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }
    await page.render({ canvasContext: context, viewport }).promise;
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png"
            });
            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob"
            });
          }
        },
        "image/png",
        1
      );
    });
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`
    };
  }
}
async function extractPdfText(file) {
  try {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const pages = Math.min(pdf.numPages, 8);
    const chunks = [];
    for (let pageNumber = 1; pageNumber <= pages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str || "").join(" ");
      chunks.push(pageText);
    }
    return chunks.join("\n").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}
const CORE_SKILLS = [
  "react",
  "typescript",
  "javascript",
  "node",
  "express",
  "next.js",
  "html",
  "css",
  "tailwind",
  "python",
  "java",
  "sql",
  "mongodb",
  "postgresql",
  "aws",
  "docker",
  "git",
  "api",
  "testing",
  "figma",
  "redux",
  "communication",
  "leadership",
  "problem solving",
  "data analysis",
  "machine learning"
];
const SECTION_WORDS = ["experience", "education", "projects", "skills", "summary"];
const ACTION_WORDS = ["built", "created", "improved", "optimized", "led", "launched", "reduced", "increased", "designed", "developed"];
const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));
const includesTerm = (text, term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
const unique = (items) => [...new Set(items.map((item) => item.toLowerCase().trim()).filter(Boolean))];
function getJobKeywords(jobDescription, jobTitle) {
  const jobText = `${jobTitle} ${jobDescription}`.toLowerCase();
  const skillMatches = CORE_SKILLS.filter((skill) => includesTerm(jobText, skill));
  const wordMatches = unique(jobText.match(/\b[a-z][a-z+#.]{2,}\b/g) || []).filter((word) => !["and", "the", "for", "with", "you", "our", "are", "from", "this", "that", "will", "job", "role"].includes(word)).slice(0, 10);
  return unique([...skillMatches, ...wordMatches]).slice(0, 14);
}
const makeTips = (score, good, improve, explanation) => ({
  score,
  tips: [
    {
      type: score >= 70 ? "good" : "improve",
      tip: score >= 70 ? good : improve,
      explanation
    }
  ]
});
function analyzeResume({
  resumeText,
  jobTitle,
  jobDescription
}) {
  const text = resumeText.toLowerCase();
  const words = text.match(/\b[a-z0-9+#.]+\b/g) || [];
  const wordCount = words.length;
  const jobKeywords = getJobKeywords(jobDescription, jobTitle);
  const fallbackKeywords = CORE_SKILLS.slice(0, 10);
  const targetKeywords = jobKeywords.length ? jobKeywords : fallbackKeywords;
  const matchedKeywords = targetKeywords.filter((keyword) => includesTerm(text, keyword));
  const missingKeywords = targetKeywords.filter((keyword) => !includesTerm(text, keyword));
  const presentSkills = CORE_SKILLS.filter((skill) => includesTerm(text, skill));
  const missingSkills = CORE_SKILLS.filter((skill) => targetKeywords.includes(skill) && !presentSkills.includes(skill)).slice(0, 6);
  const sectionsFound = SECTION_WORDS.filter((section) => includesTerm(text, section)).length;
  const actionWordsFound = ACTION_WORDS.filter((word) => includesTerm(text, word)).length;
  const hasMetrics = /\b\d+%|\$\d+|\b\d+\s*(users|clients|projects|apps|teams|months|years)\b/i.test(resumeText);
  const atsScore = clamp(45 + matchedKeywords.length / targetKeywords.length * 35 + sectionsFound * 4);
  const contentScore = clamp(35 + Math.min(wordCount / 8, 30) + actionWordsFound * 4 + (hasMetrics ? 15 : 0));
  const structureScore = clamp(45 + sectionsFound * 9 + (wordCount > 250 ? 10 : 0));
  const skillsScore = clamp(35 + Math.min(presentSkills.length * 7, 45) + (missingSkills.length ? 0 : 10));
  const toneScore = clamp(50 + actionWordsFound * 5 + (hasMetrics ? 10 : 0));
  const overallScore = clamp((atsScore + contentScore + structureScore + skillsScore + toneScore) / 5);
  const improvementTips = [
    hasMetrics ? "Keep the measurable achievements visible near the top of each role." : "Add measurable outcomes such as percentages, scale, revenue, users, or time saved.",
    missingKeywords.length ? `Add role-specific keywords naturally: ${missingKeywords.slice(0, 5).join(", ")}.` : "Your target keywords are well represented. Keep them readable and contextual.",
    sectionsFound < SECTION_WORDS.length ? "Use clear section headings for Summary, Skills, Experience, Projects, and Education." : "The resume structure is easy for recruiters and ATS tools to scan.",
    actionWordsFound < 4 ? "Start bullets with stronger action verbs like built, optimized, led, launched, and improved." : "Action verbs are helping your experience sound active and ownership-driven."
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
        { type: missingKeywords.length <= 3 ? "good" : "improve", tip: missingKeywords.length <= 3 ? "Keyword coverage is focused." : `Missing: ${missingKeywords.slice(0, 5).join(", ")}.` }
      ]
    },
    keywordMatches: targetKeywords.map((keyword) => ({
      keyword,
      matched: matchedKeywords.includes(keyword)
    })),
    skillGap: {
      present: presentSkills,
      missing: missingSkills,
      recommendations: missingSkills.length ? missingSkills.map((skill) => `Build or describe one project that demonstrates ${skill}.`) : ["Your listed skills align well with the target role. Add project proof for your strongest skills."],
      items: targetKeywords.filter((keyword) => CORE_SKILLS.includes(keyword)).map((skill) => ({ skill, status: presentSkills.includes(skill) ? "present" : "missing" }))
    },
    interviewQuestions: presentSkills.slice(0, 5).map((skill) => `Tell me about a project where you used ${skill} and what result it created.`).concat([
      `How would you explain your fit for a ${jobTitle || "target"} role in 60 seconds?`,
      "Which resume project best shows ownership, tradeoffs, and measurable impact?"
    ]).slice(0, 6),
    improvementTips,
    toneAndStyle: makeTips(toneScore, "Confident professional tone", "Strengthen ownership language", "Use active verbs and concise bullets so your impact is clear quickly."),
    content: makeTips(contentScore, "Impact is visible", "Add stronger achievements", "Recruiters look for proof: scope, tools, metrics, and outcomes."),
    structure: makeTips(structureScore, "ATS-friendly structure", "Improve section clarity", "Standard headings and clean ordering make the resume easier to scan."),
    skills: makeTips(skillsScore, "Relevant skills detected", "Close skill gaps", "Match the skills section to the target role and support key skills in project bullets.")
  };
}
const Upload = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState(null);
  const handleFileSelect = (file2) => {
    setFile(file2);
  };
  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file: file2
  }) => {
    setIsProcessing(true);
    setStatusText("Reading resume content...");
    const resumeText = await extractPdfText(file2);
    setStatusText("Creating resume preview...");
    const imageFile = await convertPdfToImage(file2);
    if (!imageFile.file) return setStatusText("Error: Failed to convert PDF to image");
    setStatusText("Preparing local analysis...");
    const resumePath = await fileToDataUrl(file2);
    const imagePath = await fileToDataUrl(imageFile.file);
    setStatusText("Analyzing ATS fit and skill gaps...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath,
      imagePath,
      companyName,
      jobTitle,
      jobDescription,
      fileName: file2.name,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      feedback: analyzeResume({
        resumeText,
        jobTitle,
        jobDescription
      })
    };
    resumeStore.save(data);
    setStatusText("Analysis complete, redirecting...");
    navigate(`/resume/${uuid}`);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name");
    const jobTitle = formData.get("job-title");
    const jobDescription = formData.get("job-description");
    if (!file) return;
    handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file
    });
  };
  return /* @__PURE__ */ jsxs("main", {
    className: "app-shell",
    children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsx("section", {
      className: "main-section",
      children: /* @__PURE__ */ jsxs("div", {
        className: "upload-layout",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "upload-copy",
          children: [/* @__PURE__ */ jsx("p", {
            className: "eyebrow",
            children: "Portfolio-ready resume intelligence"
          }), /* @__PURE__ */ jsx("h1", {
            children: "Upload once. Get a recruiter-style action plan."
          }), /* @__PURE__ */ jsx("h2", {
            children: "CareerLens checks ATS keywords, resume score, skill gaps, interview questions, and practical improvement tips."
          })]
        }), isProcessing ? /* @__PURE__ */ jsxs("div", {
          className: "processing-card",
          children: [/* @__PURE__ */ jsx("div", {
            className: "loader-ring"
          }), /* @__PURE__ */ jsx("h2", {
            children: statusText
          }), /* @__PURE__ */ jsx("p", {
            children: "Scanning structure, keywords, skills, and interview signals."
          })]
        }) : /* @__PURE__ */ jsx("div", {
          className: "form-card",
          children: !isProcessing && /* @__PURE__ */ jsxs("form", {
            id: "upload-form",
            onSubmit: handleSubmit,
            className: "flex flex-col gap-4 mt-8",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "form-div",
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "company-name",
                children: "Company Name"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                name: "company-name",
                placeholder: "Company Name",
                id: "company-name"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "form-div",
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "job-title",
                children: "Job Title"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                name: "job-title",
                placeholder: "Job Title",
                id: "job-title"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "form-div",
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "job-description",
                children: "Job Description"
              }), /* @__PURE__ */ jsx("textarea", {
                rows: 5,
                name: "job-description",
                placeholder: "Job Description",
                id: "job-description"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "form-div",
              children: [/* @__PURE__ */ jsx("label", {
                htmlFor: "uploader",
                children: "Upload Resume"
              }), /* @__PURE__ */ jsx(FileUploader, {
                onFileSelect: handleFileSelect
              })]
            }), /* @__PURE__ */ jsx("button", {
              className: "primary-button",
              type: "submit",
              children: "Analyze Resume"
            })]
          })
        })]
      })
    }), /* @__PURE__ */ jsx(Footer, {})]
  });
};
const upload = UNSAFE_withComponentProps(Upload);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: upload
}, Symbol.toStringTag, { value: "Module" }));
const ScoreGauge = ({ score = 75 }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);
  const percentage = score / 100;
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsxs("div", { className: "relative w-40 h-20", children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 50", className: "w-full h-full", children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
        "linearGradient",
        {
          id: "gaugeGradient",
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "0%",
          children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#a78bfa" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#fca5a5" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M10,50 A40,40 0 0,1 90,50",
          fill: "none",
          stroke: "#e5e7eb",
          strokeWidth: "10",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          ref: pathRef,
          d: "M10,50 A40,40 0 0,1 90,50",
          fill: "none",
          stroke: "url(#gaugeGradient)",
          strokeWidth: "10",
          strokeLinecap: "round",
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength * (1 - percentage)
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center pt-2", children: /* @__PURE__ */ jsxs("div", { className: "text-xl font-semibold pt-4", children: [
      score,
      "/100"
    ] }) })
  ] }) });
};
const ScoreBadge$1 = ({ score }) => {
  let badgeColor = "";
  let badgeText = "";
  if (score > 70) {
    badgeColor = "bg-badge-green text-green-600";
    badgeText = "Strong";
  } else if (score > 49) {
    badgeColor = "bg-badge-yellow text-yellow-600";
    badgeText = "Good Start";
  } else {
    badgeColor = "bg-badge-red text-red-600";
    badgeText = "Needs Work";
  }
  return /* @__PURE__ */ jsx("div", { className: `px-3 py-1 rounded-full ${badgeColor}`, children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: badgeText }) });
};
const Category = ({ title, score }) => {
  const textColor = score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";
  return /* @__PURE__ */ jsx("div", { className: "resume-summary", children: /* @__PURE__ */ jsxs("div", { className: "category", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center justify-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-2xl", children: title }),
      /* @__PURE__ */ jsx(ScoreBadge$1, { score })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-2xl", children: [
      /* @__PURE__ */ jsx("span", { className: textColor, children: score }),
      "/100"
    ] })
  ] }) });
};
const Summary = ({ feedback }) => {
  return /* @__PURE__ */ jsxs("div", { className: "analysis-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center p-4 gap-8", children: [
      /* @__PURE__ */ jsx(ScoreGauge, { score: feedback.overallScore }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Resume Score" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "A combined score for ATS fit, content, structure, tone, and skill alignment." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Category, { title: "Tone & Style", score: feedback.toneAndStyle.score }),
    /* @__PURE__ */ jsx(Category, { title: "Content", score: feedback.content.score }),
    /* @__PURE__ */ jsx(Category, { title: "Structure", score: feedback.structure.score }),
    /* @__PURE__ */ jsx(Category, { title: "Skills", score: feedback.skills.score })
  ] });
};
const ATS = ({ score, suggestions }) => {
  const subtitle = score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";
  return /* @__PURE__ */ jsxs("div", { className: "analysis-card ats-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "metric-icon", children: "ATS" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold", children: [
          "ATS Score - ",
          score,
          "/100"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "muted-text", children: subtitle })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "muted-text mb-4", children: "This score estimates how clearly your resume can be parsed and matched against the target role." }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: suggestions.map((suggestion, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: suggestion.type === "good" ? "status-dot good" : "status-dot improve" }),
      /* @__PURE__ */ jsx("p", { className: suggestion.type === "good" ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300", children: suggestion.tip })
    ] }, `${suggestion.tip}-${index}`)) })
  ] });
};
const AccordionContext = createContext(
  void 0
);
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};
const Accordion = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = ""
}) => {
  const [activeItems, setActiveItems] = useState(
    defaultOpen ? [defaultOpen] : []
  );
  const toggleItem = (id) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };
  const isItemActive = (id) => activeItems.includes(id);
  return /* @__PURE__ */ jsx(
    AccordionContext.Provider,
    {
      value: { activeItems, toggleItem, isItemActive },
      children: /* @__PURE__ */ jsx("div", { className: `space-y-2 ${className}`, children })
    }
  );
};
const AccordionItem = ({
  id,
  children,
  className = ""
}) => {
  return /* @__PURE__ */ jsx("div", { className: `overflow-hidden border-b border-gray-200 ${className}`, children });
};
const AccordionHeader = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right"
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);
  const defaultIcon = /* @__PURE__ */ jsx(
    "svg",
    {
      className: cn("w-5 h-5 transition-transform duration-200", {
        "rotate-180": isActive
      }),
      fill: "none",
      stroke: "#98A2B3",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M19 9l-7 7-7-7"
        }
      )
    }
  );
  const handleClick = () => {
    toggleItem(itemId);
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: handleClick,
      className: `
        w-full px-4 py-3 text-left
        focus:outline-none
        transition-colors duration-200 flex items-center justify-between cursor-pointer
        ${className}
      `,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          iconPosition === "left" && (icon || defaultIcon),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children })
        ] }),
        iconPosition === "right" && (icon || defaultIcon)
      ]
    }
  );
};
const AccordionContent = ({
  itemId,
  children,
  className = ""
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `
        overflow-hidden transition-all duration-300 ease-in-out
        ${isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0"}
        ${className}
      `,
      children: /* @__PURE__ */ jsx("div", { className: "px-4 py-3 ", children })
    }
  );
};
const ScoreBadge = ({ score }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69 ? "bg-badge-green" : score > 39 ? "bg-badge-yellow" : "bg-badge-red"
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: score > 69 ? "status-dot good !mt-0" : "status-dot improve !mt-0" }),
        /* @__PURE__ */ jsxs(
          "p",
          {
            className: cn(
              "text-sm font-medium",
              score > 69 ? "text-badge-green-text" : score > 39 ? "text-badge-yellow-text" : "text-badge-red-text"
            ),
            children: [
              score,
              "/100"
            ]
          }
        )
      ]
    }
  );
};
const CategoryHeader = ({
  title,
  categoryScore
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-4 items-center py-2", children: [
    /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold", children: title }),
    /* @__PURE__ */ jsx(ScoreBadge, { score: categoryScore })
  ] });
};
const CategoryContent = ({
  tips
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 items-center w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-slate-50 dark:bg-slate-950 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1", children: tips.map((tip, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center", children: [
      /* @__PURE__ */ jsx("span", { className: tip.type === "good" ? "status-dot good !mt-0" : "status-dot improve !mt-0" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-slate-500 dark:text-slate-300", children: tip.tip })
    ] }, index)) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 w-full", children: tips.map((tip, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "flex flex-col gap-2 rounded-xl p-4",
          tip.type === "good" ? "bg-green-50 border border-green-200 text-green-700 dark:bg-green-950 dark:border-green-900 dark:text-green-300" : "bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2 items-center", children: [
            /* @__PURE__ */ jsx("span", { className: tip.type === "good" ? "status-dot good !mt-0" : "status-dot improve !mt-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl font-semibold", children: tip.tip })
          ] }),
          /* @__PURE__ */ jsx("p", { children: tip.explanation })
        ]
      },
      index + tip.tip
    )) })
  ] });
};
const Details = ({ feedback }) => {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 w-full", children: /* @__PURE__ */ jsxs(Accordion, { children: [
    /* @__PURE__ */ jsxs(AccordionItem, { id: "tone-style", children: [
      /* @__PURE__ */ jsx(AccordionHeader, { itemId: "tone-style", children: /* @__PURE__ */ jsx(
        CategoryHeader,
        {
          title: "Tone & Style",
          categoryScore: feedback.toneAndStyle.score
        }
      ) }),
      /* @__PURE__ */ jsx(AccordionContent, { itemId: "tone-style", children: /* @__PURE__ */ jsx(CategoryContent, { tips: feedback.toneAndStyle.tips }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { id: "content", children: [
      /* @__PURE__ */ jsx(AccordionHeader, { itemId: "content", children: /* @__PURE__ */ jsx(
        CategoryHeader,
        {
          title: "Content",
          categoryScore: feedback.content.score
        }
      ) }),
      /* @__PURE__ */ jsx(AccordionContent, { itemId: "content", children: /* @__PURE__ */ jsx(CategoryContent, { tips: feedback.content.tips }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { id: "structure", children: [
      /* @__PURE__ */ jsx(AccordionHeader, { itemId: "structure", children: /* @__PURE__ */ jsx(
        CategoryHeader,
        {
          title: "Structure",
          categoryScore: feedback.structure.score
        }
      ) }),
      /* @__PURE__ */ jsx(AccordionContent, { itemId: "structure", children: /* @__PURE__ */ jsx(CategoryContent, { tips: feedback.structure.tips }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { id: "skills", children: [
      /* @__PURE__ */ jsx(AccordionHeader, { itemId: "skills", children: /* @__PURE__ */ jsx(
        CategoryHeader,
        {
          title: "Skills",
          categoryScore: feedback.skills.score
        }
      ) }),
      /* @__PURE__ */ jsx(AccordionContent, { itemId: "skills", children: /* @__PURE__ */ jsx(CategoryContent, { tips: feedback.skills.tips }) })
    ] })
  ] }) });
};
const Section = ({ title, children }) => /* @__PURE__ */ jsxs("section", { className: "insight-panel", children: [
  /* @__PURE__ */ jsx("h3", { children: title }),
  children
] });
const InsightSections = ({ feedback }) => {
  return /* @__PURE__ */ jsxs("div", { className: "insight-grid", children: [
    /* @__PURE__ */ jsx(Section, { title: "ATS Keyword Matching", children: /* @__PURE__ */ jsx("div", { className: "keyword-cloud", children: feedback.keywordMatches.map((item) => /* @__PURE__ */ jsx("span", { className: cn("keyword-pill", item.matched ? "matched" : "missing"), children: item.keyword }, item.keyword)) }) }),
    /* @__PURE__ */ jsx(Section, { title: "Skill Gap Analysis", children: /* @__PURE__ */ jsxs("div", { className: "skill-columns", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mini-label", children: "Present" }),
        /* @__PURE__ */ jsx("ul", { children: (feedback.skillGap.present.length ? feedback.skillGap.present : ["Add more technical skills"]).map((skill) => /* @__PURE__ */ jsx("li", { children: skill }, skill)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mini-label", children: "To Improve" }),
        /* @__PURE__ */ jsx("ul", { children: (feedback.skillGap.missing.length ? feedback.skillGap.missing : ["No major target gaps"]).map((skill) => /* @__PURE__ */ jsx("li", { children: skill }, skill)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Interview Question Suggestions", children: /* @__PURE__ */ jsx("ul", { className: "numbered-list", children: feedback.interviewQuestions.map((question) => /* @__PURE__ */ jsx("li", { children: question }, question)) }) }),
    /* @__PURE__ */ jsx(Section, { title: "Resume Improvement Tips", children: /* @__PURE__ */ jsx("ul", { className: "tip-list", children: feedback.improvementTips.map((tip) => /* @__PURE__ */ jsx("li", { children: tip }, tip)) }) })
  ] });
};
const meta = () => [{
  title: "CareerLens | Resume Review"
}, {
  name: "description",
  content: "Detailed overview of your resume"
}];
const Resume = () => {
  const {
    id
  } = useParams();
  const [resume2, setResume] = useState(null);
  const [feedback, setFeedback] = useState(null);
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
  return /* @__PURE__ */ jsxs("main", {
    className: "app-shell !pt-0",
    children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsx("nav", {
      className: "resume-nav",
      children: /* @__PURE__ */ jsxs(Link, {
        to: "/",
        className: "back-button",
        children: [/* @__PURE__ */ jsx("span", {
          children: "<"
        }), /* @__PURE__ */ jsx("span", {
          children: "Back to dashboard"
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "review-layout",
      children: [/* @__PURE__ */ jsx("section", {
        className: "preview-section",
        children: resume2 && /* @__PURE__ */ jsx("div", {
          className: "resume-preview animate-in fade-in duration-700",
          children: /* @__PURE__ */ jsx("a", {
            href: resume2.resumePath,
            target: "_blank",
            rel: "noopener noreferrer",
            children: /* @__PURE__ */ jsx("img", {
              src: resume2.imagePath,
              className: "w-full h-full object-contain rounded-xl",
              title: "resume"
            })
          })
        })
      }), /* @__PURE__ */ jsxs("section", {
        className: "feedback-section",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "eyebrow",
            children: "Analysis dashboard"
          }), /* @__PURE__ */ jsx("h2", {
            className: "section-title",
            children: "Resume Review"
          }), (resume2 == null ? void 0 : resume2.jobTitle) && /* @__PURE__ */ jsxs("p", {
            className: "muted-text",
            children: [resume2.jobTitle, resume2.companyName ? ` at ${resume2.companyName}` : ""]
          })]
        }), feedback ? /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-8 animate-in fade-in duration-1000",
          children: [/* @__PURE__ */ jsx(Summary, {
            feedback
          }), /* @__PURE__ */ jsx(ATS, {
            score: feedback.ATS.score || 0,
            suggestions: feedback.ATS.tips || []
          }), /* @__PURE__ */ jsx(InsightSections, {
            feedback
          }), /* @__PURE__ */ jsx(Details, {
            feedback
          })]
        }) : /* @__PURE__ */ jsxs("div", {
          className: "processing-card",
          children: [/* @__PURE__ */ jsx("div", {
            className: "loader-ring"
          }), /* @__PURE__ */ jsx("p", {
            children: "Loading analysis..."
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx(Footer, {})]
  });
};
const resume = UNSAFE_withComponentProps(Resume);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: resume,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DnnKRd8f.js", "imports": ["/assets/chunk-QMGIS6GS-BTCkig-z.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-B0bWp7zq.js", "imports": ["/assets/chunk-QMGIS6GS-BTCkig-z.js"], "css": ["/assets/root-YJKFI3Ez.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-8ZAuQxvU.js", "imports": ["/assets/chunk-QMGIS6GS-BTCkig-z.js", "/assets/resumeStore-D8gFGcMb.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/upload": { "id": "routes/upload", "parentId": "root", "path": "/upload", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/upload-DLAVqxtv.js", "imports": ["/assets/chunk-QMGIS6GS-BTCkig-z.js", "/assets/resumeStore-D8gFGcMb.js", "/assets/utils-Dyb0fcCl.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/resume": { "id": "routes/resume", "parentId": "root", "path": "/resume/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/resume-B8wNKY9g.js", "imports": ["/assets/chunk-QMGIS6GS-BTCkig-z.js", "/assets/utils-Dyb0fcCl.js", "/assets/resumeStore-D8gFGcMb.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-1df786af.js", "version": "1df786af", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/upload": {
    id: "routes/upload",
    parentId: "root",
    path: "/upload",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/resume": {
    id: "routes/resume",
    parentId: "root",
    path: "/resume/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
