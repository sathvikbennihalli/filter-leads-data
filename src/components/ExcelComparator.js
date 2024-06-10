import React, { useState } from "react";
import * as XLSX from "xlsx";
import FileUpload from "./FileUpload";
import { ClipLoader } from "react-spinners";
import "../assets/css/App.css"; // Ensure this is pointing to the correct path of your CSS file

const ExcelComparator = () => {
  const [remainingData, setRemainingData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalColumns, setTotalColumns] = useState(0);
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleFileUploaded = (file) => {
    setLoading(true); // Start loading
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the sheets are named 'ENTIRE_SHEET' and 'FILTER_DATA'
      const entireSheet = XLSX.utils.sheet_to_json(
        workbook.Sheets["ENTIRE_DATA"]
      );
      const filteredSheet = XLSX.utils.sheet_to_json(
        workbook.Sheets["FILTERED_DATA"]
      );

      // Compare the sheets and get remaining data
      const remaining = compareSheets(entireSheet, filteredSheet);
      setRemainingData(remaining);

      // Update total rows and columns
      if (remaining.length > 0) {
        setTotalRows(remaining.length);
        setTotalColumns(Object.keys(remaining[0]).length);
      } else {
        setTotalRows(0);
        setTotalColumns(0);
      }

      setLoading(false); // End loading
    };

    reader.readAsArrayBuffer(file);
  };

  const compareSheets = (entireSheet, filteredSheet) => {
    // Normalize and extract the list of PHONE_NUMBERs from FILTER_DATA
    const filteredNumbers = new Set(
      filteredSheet.map((row) => String(row.PHONE_NUMBER).trim().toLowerCase())
    );

    // Filter ENTIRE_SHEET to include only rows whose normalized PHONE_NUMBER is not in the filteredNumbers set
    const remaining = entireSheet.filter((row) => {
      const phoneNumber = String(row.PHONE_NUMBER).trim().toLowerCase();
      console.log(`Checking ${phoneNumber} against filtered data...`); // Debugging log
      return !filteredNumbers.has(phoneNumber);
    });

    console.log("Filtered out the following rows:", remaining); // Debugging log
    return remaining;
  };

  return (
    <div className="container">
      <FileUpload onFileUploaded={handleFileUploaded} />
      <h2>Remaining Data</h2>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#007bff"} loading={loading} />
          <span className="spinner-text">Loading data, please wait...</span>
        </div>
      ) : remainingData.length > 0 ? (
        <>
          <p>Total Rows: {totalRows}</p>
          <p>Total Columns: {totalColumns}</p>
          <table>
            <thead>
              <tr>
                {Object.keys(remainingData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {remainingData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No unmatched data found.</p>
      )}
    </div>
  );
};

export default ExcelComparator;
