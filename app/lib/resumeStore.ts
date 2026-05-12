const STORAGE_KEY = "career-lens-resumes";

const readResumes = (): Resume[] => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as Resume[];
  } catch {
    return [];
  }
};

const writeResumes = (resumes: Resume[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};

export const resumeStore = {
  all: () => readResumes().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  get: (id: string) => readResumes().find((resume) => resume.id === id) || null,
  save: (resume: Resume) => {
    const resumes = readResumes().filter((item) => item.id !== resume.id);
    writeResumes([resume, ...resumes]);
  },
  clear: () => writeResumes([]),
};
