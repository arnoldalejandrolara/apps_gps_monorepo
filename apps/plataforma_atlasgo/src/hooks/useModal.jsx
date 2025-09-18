import { useContext } from 'react';
import { ModalContext } from '../App';

export const useModal = () => {
  return useContext(ModalContext);
};