export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  zone: string;
  timestamp: string;
}

export const INITIAL_REVIEWS: Review[] = [
  { id: "r1", author: "Priya M.", text: "Amazing atmosphere! The crowd is electric for this GT match.", rating: 5, zone: "Stand J", timestamp: "7:15 PM" },
  { id: "r2", author: "Amit K.", text: "Food queue at Samosa Junction is way too long. Need more counters.", rating: 2, zone: "Pavilion Center", timestamp: "7:22 PM" },
  { id: "r3", author: "Sneha R.", text: "Great view from the upper tier. Signage could be better for finding seats.", rating: 4, zone: "Stand N", timestamp: "7:35 PM" },
  { id: "r4", author: "Rajesh P.", text: "Clean restrooms and helpful staff near Stand K. Impressed.", rating: 4, zone: "Stand K", timestamp: "7:41 PM" },
];
