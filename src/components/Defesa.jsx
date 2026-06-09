import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function Defesa({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
