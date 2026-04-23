import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItemById, updateItem } from '../api';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

const EditItem = () => {
    const { id } = useParams();
    const { getToken } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    
    // State for form fields, separate from file handling
    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for new image file and its preview
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await getItemById(id);
                const itemData = response.data;
                
                // Format date for the input field
                if (itemData.found_date) {
                    itemData.found_date = new Date(itemData.found_date).toISOString().split('T')[0];
                }

                // Set initial form data and the image preview for the existing image
                setFormData({
                    itemName: itemData.item_name || '',
                    description: itemData.description || '',
                    category: itemData.category || '',
                    locationFound: itemData.location_found || '',
                    foundDate: itemData.found_date || '',
                    imageUrl: itemData.image_url || '' // Keep track of the original URL
                });
                setImagePreview(itemData.image_url || '');

            } catch (error) {
                console.log(error)
                toast.error("Could not fetch item data.");
                navigate('/my-listings');
            }
        };
        fetchItem();
    }, [id, navigate]);

    // Handle form field text changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle new image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Store the file object
            setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const finalImageUrl = imagePreview || formData.imageUrl;

        try {
            const finalData = { ...formData, imageUrl: finalImageUrl };
            await updateItem(id, finalData, getToken);
            toast.success('Item updated successfully!');
            addNotification(`Dummy upload: ${finalData.itemName || 'Item'} was updated.`);
            navigate('/my-listings');
        } catch (error) {
            console.log(error)
            toast.error('Failed to update item.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!formData) return <div className="text-center py-20">Loading...</div>;

    return (
         <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-blue-100 shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Edit Item</h1>
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
                                    <span>Change image</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" 
                                           accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Text Input Fields */}
                <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name*</label>
                    <input type="text" name="itemName" id="itemName" required onChange={handleChange} value={formData.itemName} 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" rows="4" onChange={handleChange} value={formData.description} 
                              className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"></textarea>
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <input type="text" name="category" id="category" onChange={handleChange} value={formData.category} 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                <div>
                    <label htmlFor="locationFound" className="block text-sm font-medium text-gray-700">Location Found*</label>
                    <input type="text" name="locationFound" id="locationFound" required onChange={handleChange} value={formData.locationFound} 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                <div>
                    <label htmlFor="foundDate" className="block text-sm font-medium text-gray-700">Date Found</label>
                    <input type="date" name="foundDate" id="foundDate" onChange={handleChange} value={formData.foundDate} 
                           className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3"/>
                </div>
                
                {/* Submit Button */}
                <div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditItem;