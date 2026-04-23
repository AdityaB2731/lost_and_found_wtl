import { useState, useEffect } from 'react';
import { getMyClaims } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    const statusClasses = {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const MyClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await getMyClaims(getToken);
                setClaims(response.data);
            } catch {
                toast.error("Could not fetch your claims.");
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, [getToken]);

    if (loading) return <div className="text-center py-10">Loading your claims...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">My Claims</h1>
            {claims.length === 0 ? (
                <p className="text-center text-slate-500 bg-white p-8 rounded-lg shadow">You haven't made any claims yet.</p>
            ) : (
                <div className="space-y-4">
                    {claims.map(claim => (
                        <div key={claim.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={claim.image_url || 'https://via.placeholder.com/100'} alt={claim.item_name} className="w-20 h-20 rounded-md object-cover"/>
                                <div>
                                    <h2 className="font-bold text-lg">{claim.item_name}</h2>
                                    <p className="text-sm text-slate-500 mt-1">{claim.claim_message}</p>
                                </div>
                            </div>
                            <StatusBadge status={claim.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyClaims;