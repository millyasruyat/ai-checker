import mammoth from 'mammoth';

export const extractTextFromDocx = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error("Failed to read file buffer."));
          return;
        }

        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        console.error("Mammoth extraction error:", error);
        reject(new Error("Could not parse Word document. Please ensure it is a valid .docx file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("File reading failed."));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || "");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};