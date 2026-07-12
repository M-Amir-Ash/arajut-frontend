import {Navigate,useLocation} from 'react-router-dom';import {useAuth} from '../context/AuthContext'
export function ProtectedRoute({children}){const {user}=useAuth();const location=useLocation();return user?children:<Navigate to="/login" replace state={{from:location.pathname}}/>}
export function AdminProtectedRoute({children}){const {admin}=useAuth();return admin?children:<Navigate to="/admin/login" replace/>}
