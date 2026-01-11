export type SubjectModel = {
extensions: any;       // Changed from 'Subject' to 'SubjectModel' to avoid naming conflicts. We might add other types.
  id: string;
  name: string;
  created_at: Date;
  pinned: boolean;
  topicCount: number;
  tags: string[];
  enabledExtensions: string[];
  status: string; // pending document upload, pending topic labelling, pending topics selection, pending lesson generation, pending exercise generation, pending exam generation, in progress, completed
  completion: number; // Percentage from 0 to 100
}
