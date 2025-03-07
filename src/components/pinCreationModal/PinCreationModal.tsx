import React from 'react';

const PinCreationModal = ({ redirect }) => {
    return (
        <div className="modal z-10 py-4 bg-white shadow-md rounded-lg p-6 max-w-md mx-auto text-center">
            <div className="modal-content">
                <p className="text-xl font-bold mb-4">Create PIN</p>
                <p className="text-lg mb-6">You have not created a PIN yet. Please create a PIN to continue.</p>
                <button
                    onClick={redirect}
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create PIN
                </button>
            </div>
        </div>
    );
};

export default PinCreationModal;
