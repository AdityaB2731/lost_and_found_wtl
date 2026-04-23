import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllItems } from '../api';
import ItemCard from '../components/ItemCard';
import { Search, PackageSearch, AlertTriangle } from 'lucide-react';

// A simple Skeleton Card component for the loading state
const SkeletonCard = () => (
  <div className="glass-surface overflow-hidden rounded-2xl animate-pulse">
    <div className="h-48 w-full bg-blue-100"></div>
    <div className="p-4">
      <div className="mb-2 h-6 w-3/4 rounded bg-blue-100"></div>
      <div className="mb-4 h-4 w-full rounded bg-blue-100"></div>
      <div className="h-4 w-1/2 rounded bg-blue-100"></div>
    </div>
  </div>
);

const Browse = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('available'); // 'available' or 'claimed'

  // Effect to fetch initial data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItems();
        setItems(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Failed to fetch items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    let processedItems = [...items];

    // Apply search filter
    if (searchTerm) {
      processedItems = processedItems.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    processedItems = processedItems.filter(item => item.status === statusFilter);

    // Apply sorting
    processedItems.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return processedItems;
  }, [items, searchTerm, sortBy]);


  if (error) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">Oops! Something went wrong.</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="glass-surface mb-8 rounded-[1.6rem] p-6 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Browse Found Items</h1>
            <p className="mt-1 text-slate-600">
          Look through items reported by the community. Use the search to find what you're looking for.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex gap-1 rounded-xl bg-blue-50 p-1">
              <button
                onClick={() => setStatusFilter('available')}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  statusFilter === 'available' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-900/60 hover:text-blue-900'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setStatusFilter('claimed')}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  statusFilter === 'claimed' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-900/60 hover:text-blue-900'
                }`}
              >
                Claimed
              </button>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {filteredItems.length} results
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Search by item name..."
              className="w-full rounded-xl border border-blue-200 bg-white px-10 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
             <select
              className="w-full appearance-none rounded-xl border border-blue-200 bg-white px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:w-48"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid or Loading/Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="glass-surface rounded-2xl py-20 text-center">
          <PackageSearch className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            {searchTerm ? 'No items match your search' : 'No items have been listed yet'}
          </h2>
          <p className="text-slate-500 mb-6">
            {searchTerm ? 'Try a different search term.' : 'Be the first to help someone out!'}
          </p>
          <Link to="/add-item" className="brand-button rounded-full px-6 py-3 font-semibold">
            List a Found Item
          </Link>
        </div>
      )}
    </div>
  );
};

export default Browse;