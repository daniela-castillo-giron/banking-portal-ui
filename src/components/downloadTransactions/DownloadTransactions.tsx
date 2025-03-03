import React from 'react';
import * as XLSX from 'xlsx';

const DownloadTransactions = ({ data }) => {
    const exportToExcel = () => {
        if (!data || data.length === 0) {
            alert('No transactions available to export.');
            return;
        }

        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet(data);

        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'transactions.xlsx');
    };

    return (
        <button
            className="ml-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={exportToExcel}
        >
            Export
        </button>
    );
};

export default DownloadTransactions;
