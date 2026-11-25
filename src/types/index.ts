export interface BookLocation {
  floor: number;
  section: string;
  aisle: string;
  shelf: string;
  rack: string;
  bay: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  cover: string;
  description: string;
  year: number;
  pages: number;
  isbn: string;
  topics: string[];
  prerequisites: string[];
  location: BookLocation;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bookCount: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'book' | 'subject' | 'topic';
  data?: Book | Subject;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'belongs_to' | 'requires' | 'recommends';
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
