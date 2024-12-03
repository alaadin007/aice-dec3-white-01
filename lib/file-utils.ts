import { toast } from "@/hooks/use-toast";

export async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };

    if (file.type === 'application/pdf') {
      // For PDFs, we'll need to implement PDF parsing
      toast({
        title: "PDF Support Coming Soon",
        description: "PDF parsing will be available in a future update.",
        variant: "default",
      });
      reject(new Error('PDF parsing not yet implemented'));
    } else {
      reader.readAsText(file);
    }
  });
}

export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf',
    'text/csv'
  ];
  
  return allowedTypes.includes(file.type);
}