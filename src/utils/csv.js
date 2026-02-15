import Papa from 'papaparse';

export function parseCSVRow(rowString) {
    // Use PapaParse to parse the single row string
    const results = Papa.parse(rowString, {
        header: false,
        skipEmptyLines: true,
    });

    if (results.errors.length > 0) {
        console.error("CSV Parse Error", results.errors);
        return [];
    }

    return results.data[0] || [];
}

export function generateCSV(headers, data) {
    return Papa.unparse({
        fields: headers,
        data: data
    });
}
