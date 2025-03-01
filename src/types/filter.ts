export interface Filter {
  searchTerm: string;
  types: { value: string; label: string }[];
  generation: { value: number; label: string } | null;
  sortBy: { value: string; label: string } | null;
}