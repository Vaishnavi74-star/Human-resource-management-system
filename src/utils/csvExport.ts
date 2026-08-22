/**
 * Converts an array of objects to a CSV string and triggers a file download in the browser.
 * @param data Array of objects to convert
 * @param filename Name of the file to save (without .csv extension)
 */
export function downloadCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn("No data provided for CSV export");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [];
  
  // Header row
  csvRows.push(headers.map(header => `"${header}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] === null || row[header] === undefined ? '' : row[header];
      const stringVal = String(val);
      // Escape quotes by doubling them
      const escapedVal = stringVal.replace(/"/g, '""');
      return `"${escapedVal}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Trigger download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
