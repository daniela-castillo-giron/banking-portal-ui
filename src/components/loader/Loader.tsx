import React from 'react';
import { useLoader } from '../../services/loaderModalService';
import './loader.css';

const Loader = () => {
  const { isShown, getMessage } = useLoader();

  if (!isShown()) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader"></div>
        <p>{getMessage()}</p>
      </div>
    </div>
  );
};

export default Loader;
