export interface Ingredient {
  name: string;
  qty: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  tags: string[];
  time: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  author: string;
  author_id?: string;
  rating: number;
  reviews_count?: number;
  reviewsCount?: number;
  image: string;
  desc: string;
  portion_base?: number;
  portionBase?: number;
  ingredients: Ingredient[];
  steps: string[];
  tips?: string;
  created_at?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
}
