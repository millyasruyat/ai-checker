export interface TypoItem {
  text: string;
  suggestion: string;
  context: string;
}

export interface AiSegment {
  text: string;
  reason: string;
}

export interface AnalysisResult {
  humanScore: number;
  aiScore: number;
  verdict: string;
  explanation: string;
  aiSegments: AiSegment[];
  typos: TypoItem[];
  linguisticPatterns: string[];
  toneAnalysis: string;
  methodology: string;
}

export interface FileState {
  name: string;
  content: string;
  type: 'text' | 'docx';
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}