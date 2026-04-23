import { Routes, Route } from 'react-router-dom';
import { SignInPage, SignUpPage } from './pages/Auth';
import Home from './pages/Home';
import Browse from './pages/Browse';
import AddItem from './pages/AddItem';
import MyListings from './pages/MyListings';
import Layout from './components/Layout';
import EditItem from './pages/EditItem';
import ItemDetail from './pages/ItemDetails';
import MyClaims from './pages/MyClaims';
import AdminReport from './pages/AdminReport';
import AdminDashboard from './pages/AdminDashboard';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

const RequireAuth = ({ children }) => {
  const { isSignedIn } = useAuth();
  const location = useLocation();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return children;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/browse/:id" element={<ItemDetail />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route path="/add-item" element={<RequireAuth><AddItem /></RequireAuth>} />
        <Route path="/my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
        <Route path="/edit-item/:id" element={<RequireAuth><EditItem /></RequireAuth>} />
        <Route path="/my-claims" element={<RequireAuth><MyClaims /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/report" element={<RequireAuth><AdminReport /></RequireAuth>} />

        <Route path="*" element={
          <main className="text-center py-20">
            <h1 className="text-4xl font-bold">404 - Not Found</h1>
          </main>
        }/>
      </Routes>
    </Layout>
  );
}

export default App;