export interface ComponentNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentNode[];
}

export interface PageMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface PageJSON {
  components: ComponentNode[];
  meta?: PageMeta;
}

export interface Page {
  _id: string;
  institutionId: string;
  name: string;
  slug: string;
  jsonConfig: PageJSON;
  isPublished: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreatePageData {
  name: string;
  slug: string;
}

export interface UpdatePageData {
  jsonConfig: PageJSON;
  changes?: string;
}
