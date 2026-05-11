import { ALL_CATEGORIES } from "./constants";

export function ProductFilters({
  searchInput,
  setSearchInput,
  selectedCategory,
  setSelectedCategory,
  categories,
  clearFilters,
}: {
  searchInput: string;
  setSearchInput: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: string[];
  clearFilters: () => void;
}) {
  return (
    <div className="product-filters" aria-label="Product filters">
      <label>
        <span>Search</span>
        <input
          placeholder="Search products"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </label>

      <label>
        <span>Category</span>
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value={ALL_CATEGORIES}>All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <button type="button" onClick={clearFilters}>
        Clear
      </button>
    </div>
  );
}
