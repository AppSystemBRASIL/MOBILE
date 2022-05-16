import { useContext } from 'react';
import Context from '../context';

export default function useAuth() {
  return useContext(Context);
}