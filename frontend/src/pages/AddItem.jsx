import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../api';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

const AddItem = () => {
    const { getToken } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        itemName: '', description: '', category: '',
        locationFound: '', foundDate: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('itemName', formData.itemName);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('locationFound', formData.locationFound);
            data.append('foundDate', formData.foundDate);
            if (imageFile) {
                data.append('image', imageFile);
            }

            await createItem(data, getToken);
            toast.success('Item listed successfully in DB!');
            addNotification(`${formData.itemName || 'New item'} was listed and stored in the database.`);
            navigate('/browse');
        } catch (error) {
            console.error("Failed to add item:", error);
            toast.error('Failed to list item. Please check your DB connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-blue-100 shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Report a Found Item</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-200 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="mx-auto h-40 w-auto rounded-md" />
                            ) : (
                                <UploadCloud className="mx-auto h-12 w-12 text-blue-300" />
                            )}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-700 hover:text-blue-600 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" 
                                           accept="image/*" onChange={handleImageChange} />
                                </label>
                                <p className="pl-1">or use your camera</p>
                                <input id="camera-upload" name="camera-upload" type="file" className="sr-only" 
                                       accept="image/*" capture="environment" onChange={handleImageChange} />
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Text Input Fields */}
                <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name*</label>
                    <input type="text" name="itemName" id="itemName" required onChange={handleChange} 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows="4" onChange={handleChange} 
                              className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"></textarea>
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <input type="text" name="category" id="category" onChange={handleChange} placeholder="e.g., Electronics, Keys, Wallet" 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                <div>
                    <label htmlFor="locationFound" className="block text-sm font-medium text-gray-700">Location Found*</label>
                    <input type="text" name="locationFound" id="locationFound" required onChange={handleChange} placeholder="e.g., Central Park, near the bench" 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                <div>
                    <label htmlFor="foundDate" className="block text-sm font-medium text-gray-700">Date Found</label>
                    <input type="date" name="foundDate" id="foundDate" onChange={handleChange} 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                
                {/* Submit Button */}
                <div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Submitting...' : 'List Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddItem;