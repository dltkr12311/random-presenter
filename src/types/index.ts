export interface User {
  id: string;
  name: string;
  imageUrl: string;
  selected: boolean;
  lastSelectedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
