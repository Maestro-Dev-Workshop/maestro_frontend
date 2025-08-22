export type SubjectModel = {       // Changed from 'Subject' to 'SubjectModel' to avoid naming conflicts. We might add other types.
  id: string;
  name: string;
  createdAt: Date;
  status: string;
  completion: number; // Percentage from 0 to 100
}
