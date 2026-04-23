import { MapPin, Tag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/browse/${item.id}`} className="block group">
    <div className="glass-surface relative overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-1">
      <div className={`absolute z-10 ml-3 mt-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
        item.status === 'claimed' ? 'bg-green-100 text-green-700' : 'bg-white/90 text-blue-700'
      }`}>
        {item.status === 'claimed' ? 'Claimed' : 'Active listing'}
      </div>
      <img 
        src={item.image_url || 'https://via.placeholder.com/400x250/E2E8F0/4A5568?text=No+Image'} 
        alt={item.item_name}
        className="h-48 w-full object-cover" 
      />
      <div className="p-4">
        <h3 className="mb-2 truncate text-lg font-bold text-slate-900">{item.item_name}</h3>
        <p className="mb-4 h-10 overflow-hidden text-sm text-slate-600">{item.description}</p>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            <span>{item.location_found}</span>
          </div>
          {item.category && (
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-blue-600" />
              <span>{item.category}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            <span>Found on: {formatDate(item.found_date)}</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ItemCard;