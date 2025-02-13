import React, { createContext, useContext, useState } from 'react';

// Create the Context
const LoaderContext = createContext();

// Provider component
export const LoaderProvider = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const show = (message) => {
    setModalVisible(true);
    setModalMessage(message);
  };

  const hide = () => {
    setModalVisible(false);
    setModalMessage('');
  };

  const isShown = () => isModalVisible;
  const getMessage = () => modalMessage;

  return (
    <LoaderContext.Provider value={{ show, hide, isShown, getMessage }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Custom hook for easy access
export const useLoader = () => {
  return useContext(LoaderContext);
};
