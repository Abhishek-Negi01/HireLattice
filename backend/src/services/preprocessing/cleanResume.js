export const cleanResumeText = (text) => {
  return text
    .replace(/<[^>]*>/g, " ") // strip HTML tags
    .replace(/https?:\/\/\S+/g, " ") // remove URLs (kept in structured fields)
    .replace(/[^\x20-\x7E\n]/g, " ") // remove non-ASCII except newlines
    .replace(/[ \t]{2,}/g, " ") // collapse multiple spaces/tabs
    .replace(/\n{3,}/g, "\n\n") // collapse 3+ blank lines → 2
    .replace(/^[\s\-_=*#]+$/gm, "") // remove lines that are only decorators
    .trim();
};
