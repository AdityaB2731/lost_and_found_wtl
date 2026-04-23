import { useState, useEffect } from 'react';
import { getMyListings, deleteItem } from '../api';
import { Link } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, PackagePlus, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

// --- Skeleton Component for Loading State ---
const ListingSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 animate-pulse">
        <div className="w-24 h-24 bg-slate-200 rounded-md"></div>
        <div className="flex-grow space-y-3">
            <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
            <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
            <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
        </div>
    </div>
);

// --- Main MyListings Component ---
const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();
    
    // State for the confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchListings = async () => {
        // ... (fetchListings function remains the same)
        try {
            const response = await getMyListings(getToken);
            setListings(response.data);
        } catch (error) {
            console.error("Failed to fetch listings:", error);
            toast.error("Could not fetch your listings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [getToken]);

    const openDeleteModal = (id) => {
        setItemToDelete(id);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setItemToDelete(null);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteItem(itemToDelete, getToken);
            toast.success("Listing deleted successfully!");
            setListings(listings.filter(item => item.id !== itemToDelete));
        } catch (error) {
            console.log(error)
            toast.error("Failed to delete the listing.");
        } finally {
            closeDeleteModal();
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'No date provided';
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Listings</h1>
                </div>
                <div className="space-y-4">
                    <ListingSkeleton />
                    <ListingSkeleton />
                    <ListingSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* --- Page Header --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-slate-800">My Listings</h1>
                <Link to="/add-item" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
                    <PlusCircle size={20} />
                    Add New Item
                </Link>
            </div>

            {/* --- Listings or Empty State --- */}
            {listings.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg">
                    <PackagePlus className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">No Listings Yet</h2>
                    <p className="text-slate-500 mb-6">Click the button above to report your first found item!</p>
                </div>
            ) : (
                <motion.div 
                    className="space-y-5"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {listings.map(item => (
                        <motion.div
                            key={item.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="bg-white p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                        >
                            <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.item_name} className="w-full h-40 md:h-28 md:w-28 rounded-md object-cover md:col-span-2"/>
                            
                            <div className="md:col-span-7">
                                <h2 className="font-bold text-xl text-slate-800">{item.item_name}</h2>
                                <p className="text-sm text-slate-600 mt-1">{item.location_found}</p>
                                <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>Found on: {formatDate(item.found_date)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:col-span-3 justify-start md:justify-end">
                                <Link to={`/edit-item/${item.id}`} className="p-2 rounded-full text-slate-600 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                                    <Edit size={20} />
                                </Link>
                                <button onClick={() => openDeleteModal(item.id)} className="p-2 rounded-full text-slate-600 bg-slate-100 hover:bg-red-100 hover:text-red-600 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* --- Delete Confirmation Modal --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeDeleteModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: -20 }}
                            className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full text-center"
                            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Are you sure?</h2>
                            <p className="text-slate-600 mb-6">This action cannot be undone. The listing will be permanently deleted.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={closeDeleteModal} className="py-2 px-6 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold transition-colors">
                                    Cancel
                                </button>
                                <button onClick={confirmDelete} className="py-2 px-6 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyListings;