import { books } from './books';

interface GraphNode {
  id: string;
  label: string;
  type: 'book' | 'subject' | 'topic';
  color?: string;
  size?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'belongs_to' | 'requires' | 'recommends';
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const subjectColors: Record<string, string> = {
  AI: '#DC2626',
  ML: '#7C3AED',
  'Deep Learning': '#2563EB',
  NLP: '#059669',
  Algorithms: '#D97706',
  Databases: '#0891B2',
  Networking: '#7C3AED',
  'Neural Networks': '#BE185D',
  Mathematics: '#065F46',
  Python: '#B45309',
  'Operating Systems': '#1D4ED8',
  'Data Structures': '#15803D',
  'Linear Algebra': '#9333EA',
  'Computer Architecture': '#C2410C',
  'Discrete Mathematics': '#0F766E',
};

function buildGraphData(): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const subjectSet = new Set<string>();
  const topicSet = new Set<string>();

  // Add book nodes
  books.forEach((book) => {
    nodes.push({
      id: book.id,
      label: book.title.length > 25 ? book.title.substring(0, 25) + '...' : book.title,
      type: 'book',
      color: '#DC2626',
      size: 8,
    });

    // Track subjects
    subjectSet.add(book.subject);

    // Track topics (limit to avoid clutter)
    book.topics.slice(0, 3).forEach(topic => topicSet.add(topic));
  });

  // Add subject nodes
  subjectSet.forEach((subject) => {
    nodes.push({
      id: `subject-${subject}`,
      label: subject,
      type: 'subject',
      color: subjectColors[subject] || '#3B82F6',
      size: 12,
    });
  });

  // Add topic nodes
  topicSet.forEach((topic) => {
    nodes.push({
      id: `topic-${topic}`,
      label: topic,
      type: 'topic',
      color: '#10B981',
      size: 6,
    });
  });

  // Add book → subject links
  books.forEach((book) => {
    links.push({
      source: book.id,
      target: `subject-${book.subject}`,
      type: 'belongs_to',
    });

    // Add book → topic links (first 3 topics only)
    book.topics.slice(0, 3).forEach(topic => {
      links.push({
        source: book.id,
        target: `topic-${topic}`,
        type: 'recommends',
      });
    });

    // Add prerequisite links
    book.prerequisites.forEach((prereq) => {
      const prereqBook = books.find(b =>
        b.title.toLowerCase().includes(prereq.toLowerCase()) ||
        b.subject.toLowerCase().includes(prereq.toLowerCase())
      );
      if (prereqBook) {
        links.push({
          source: book.id,
          target: prereqBook.id,
          type: 'requires',
        });
      }
    });
  });

  return { nodes, links };
}

export const graphData: GraphData = buildGraphData();
