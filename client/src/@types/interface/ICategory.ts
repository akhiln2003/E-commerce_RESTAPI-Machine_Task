export interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoryTreeNode extends ICategory {
  children: ICategoryTreeNode[];
}
