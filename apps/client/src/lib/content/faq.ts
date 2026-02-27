export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "What programming languages are supported?",
    answer:
      "Our platform supports C, C++, Java, Python, and Node.js. Each language runs in an isolated, containerized environment to ensure secure code execution. Candidates can write, compile, and run code in real-time during interviews.",
  },
  {
    id: "2",
    question: "How does the video conferencing feature work?",
    answer:
      "Video conferencing is seamlessly integrated into the interview interface. You can connect face-to-face with candidates while they code, share screens, and communicate in real-time without needing any external tools.",
  },
  {
    id: "3",
    question: "Can I manage multiple interview rounds?",
    answer:
      "Yes! Our platform supports complete multi-round interview management including DSA rounds, live projects, HR interviews, and custom rounds. Track candidate progress through each stage and collaborate with your team on hiring decisions.",
  },
  {
    id: "4",
    question: "How secure is the code execution environment?",
    answer:
      "All code runs in isolated Docker containers with strict resource limits and security policies. Each execution environment is completely separated, ensuring that candidate code cannot affect the platform or other users.",
  },
  {
    id: "5",
    question: "Can multiple team members collaborate on interviews?",
    answer:
      "Absolutely! Organizations can create teams where multiple interviewers can review candidate submissions, access analytics, share feedback, and make collaborative hiring decisions. All interview data is centralized for easy access.",
  },
  {
    id: "6",
    question: "Are interview sessions recorded?",
    answer:
      "Yes, all interview sessions including video, audio, and code submissions are recorded and can be reviewed later. This helps with quality control, team discussions, and making more informed hiring decisions.",
  },
];
