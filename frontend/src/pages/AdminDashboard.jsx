import { useEffect, useState } from 'react';
import { getAllClaims, approveClaim } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchClaims();
    }, [user, navigate]);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const response = await getAllClaims();
            setClaims(response.data);
        } catch (error) {
            console.error("Failed to fetch claims:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (claimId, status) => {
        try {
            await approveClaim({ claimId, status }); // approveClaim in api/index.js handles generic status update
            // Refresh claims
            fetchClaims();
        } catch (error) {
            alert("Failed to update claim status");
        }
    };

    const filteredClaims = filter === 'all' ? claims : claims.filter(c => c.status === filter);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
                    <p className="mt-2 text-slate-600">Review and manage all item claims across the network.</p>
                </div>
                <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
                    {['pending', 'approved', 'rejected', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
            ) : filteredClaims.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                    <p className="text-slate-500">No {filter} claims found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredClaims.map((claim) => (
                        <div key={claim.id} className="glass-surface overflow-hidden rounded-2xl border border-slate-100 p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="flex flex-col gap-6 md:flex-row">
                                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                    <img 
                                        src={claim.image_url || 'https://via.placeholder.com/150?text=No+Image'} 
                                        alt={claim.item_name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="mb-1 flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{claim.item_name}</h3>
                                            <p className="text-sm text-slate-500">Claimed by <span className="font-medium text-slate-700">{claim.userName}</span> ({claim.userEmail})</p>
                                        </div>
                                        <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                            claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            claim.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {claim.status}
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <p className="text-slate-600"><span className="font-semibold text-slate-800">Message:</span> "{claim.claim_message}"</p>
                                        <p className="text-slate-600"><span className="font-semibold text-slate-800">Contact:</span> {claim.contactPhone || 'N/A'}</p>
                                        <p className="text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                                            <span className="font-semibold text-blue-900 block mb-1">Proof Provided:</span> 
                                            {claim.proofDetails || 'No details provided.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 border-t border-slate-50 pt-4">
                                        <p className="text-xs text-slate-400">
                                            Submitted on {new Date(claim.created_at).toLocaleDateString()} at {new Date(claim.created_at).toLocaleTimeString()}
                                        </p>
                                        {claim.status === 'pending' && (
                                            <div className="ml-auto flex gap-3">
                                                <button 
                                                    onClick={() => handleAction(claim.id, 'rejected')}
                                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Reject
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(claim.id, 'approved')}
                                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
