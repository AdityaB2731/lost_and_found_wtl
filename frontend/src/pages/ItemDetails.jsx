import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItemById, getClaimsForItem, createClaim, approveClaim } from '../api';
import { MapPin, Tag, Calendar, ArrowLeft, Send, CheckCircle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

const ItemDetail = () => {
     const { id } = useParams();
    const { user, getToken } = useAuth();
    const { addNotification } = useNotifications();
    
    // State for item, claims, loading, and new claim message
    const [item, setItem] = useState(null);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [claimMessage, setClaimMessage] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [proofDetails, setProofDetails] = useState('');

    const isOwner = user && item && user.id === item.user_id;

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const itemResponse = await getItemById(id);
            setItem(itemResponse.data);

            // If the current user is the owner, fetch the claims
            if (user && itemResponse.data.user_id === user.id) {
                const claimsResponse = await getClaimsForItem(id, getToken);
                setClaims(claimsResponse.data);
            }
        } catch {
            setError('Could not fetch item details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [id, user, getToken]);

    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        if (!claimMessage.trim() || !contactPhone.trim() || !proofDetails.trim()) {
            toast.error("Please fill in all the required fields.");
            return;
        }
        try {
            await createClaim(id, { claimMessage, contactPhone, proofDetails }, getToken);
            toast.success("Your claim has been submitted!");
            addNotification(`You submitted a claim for "${item?.item_name || 'an item'}"`);
            setClaimMessage('');
            setContactPhone('');
            setProofDetails('');
            // Potentially refresh data or give user feedback
        } catch {
            toast.error("Failed to submit claim.");
        }
    };

    const handleApproveClaim = async (claimId) => {
        try {
            await approveClaim({ claimId, itemId: id }, getToken);
            toast.success("Claim approved! The item is now marked as claimed.");
            // To demonstrate the trigger, we can now check the audit log
            // Refresh all data to show the new statuses
            fetchAllData();
        } catch {
            toast.error("Failed to approve claim.");
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    if (loading) return <div className="text-center py-20">Loading item...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!item) return <div className="text-center py-20">Item not found.</div>;

    return (
        <div>
            <Link to="/browse" className="inline-flex items-center gap-2 text-indigo-600 hover:underline mb-6">
                <ArrowLeft size={20} />
                Back to all items
            </Link>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image Column */}
                    <div>
                         <img 
                            src={item.image_url || 'https://via.placeholder.com/600x400/E2E8F0/4A5568?text=No+Image'} 
                            alt={item.item_name}
                            className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{item.item_name}</h1>
                        <p className="text-slate-600 mb-6">{item.description || 'No description provided.'}</p>
                        
                        <div className="mt-auto space-y-4 pt-6 border-t">
                             <div className="flex items-center gap-3 text-lg">
                                <MapPin size={24} className="text-indigo-500" />
                                <div>
                                    <span className="font-semibold">Location Found:</span>
                                    <p className="text-slate-700">{item.location_found}</p>
                                </div>
                            </div>
                            {item.category && (
                                <div className="flex items-center gap-3 text-lg">
                                    <Tag size={24} className="text-indigo-500" />
                                    <div>
                                        <span className="font-semibold">Category:</span>
                                        <p className="text-slate-700">{item.category}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-lg">
                                <Calendar size={24} className="text-indigo-500" />
                                <div>
                                    <span className="font-semibold">Date Found:</span>
                                    <p className="text-slate-700">{formatDate(item.found_date)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {item.status === 'claimed' && (
                    <div className="bg-green-100 text-green-800 font-bold text-center py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2">
                        <CheckCircle size={20}/> ITEM CLAIMED
                    </div>
                )}
            </div>
            <div className="mt-8">
                {/* A. If user is the OWNER */}
                {isOwner && (
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Pending Claims</h2>
                        {claims.length > 0 ? (
                            claims.filter(c => c.status === 'pending').map(claim => (
                                <div key={claim.id} className="border-b last:border-b-0 py-4">
                                    <p className="font-semibold">{claim.full_name || claim.email}</p>
                                    <p className="text-slate-600 my-2">"{claim.claim_message}"</p>
                                    <button onClick={() => handleApproveClaim(claim.id)} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">
                                        Approve This Claim
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No pending claims for this item yet.</p>
                        )}
                    </div>
                )}

                {/* B. If user is NOT the owner and item is AVAILABLE */}
                {!isOwner && item.status === 'available' && (
                     <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Is This Your Item?</h2>
                        {user ? (
                            <form onSubmit={handleClaimSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">How can we contact you?</label>
                                <input
                                    type="text"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    placeholder="Phone number or WhatsApp"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Simple message</label>
                                <textarea
                                    value={claimMessage}
                                    onChange={(e) => setClaimMessage(e.target.value)}
                                    placeholder="Briefly state why you're claiming this..."
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    rows="2"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Proof of Ownership (Crucial)</label>
                                <textarea
                                    value={proofDetails}
                                    onChange={(e) => setProofDetails(e.target.value)}
                                    placeholder="Describe unique marks, color, content in bag, serial number, etc. to prove it's yours."
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    rows="4"
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                                <Send size={18}/> Submit Detailed Claim
                            </button>
                        </form>
                        ) : (
                            <div className="rounded-xl bg-blue-50 p-6 text-center">
                                <p className="text-blue-800 font-medium mb-4">You must be signed in to submit a claim.</p>
                                <Link to="/sign-in" state={{ from: `/browse/${id}` }} className="brand-button inline-block px-6 py-2 rounded-full">
                                    Sign In to Claim
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemDetail;