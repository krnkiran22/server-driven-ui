export interface Media {
  _id: string;
  institutionId: string;
  filename: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
}
