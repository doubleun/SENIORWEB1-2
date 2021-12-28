import XLSX from "xlsx"; // import xlsx
export default {
  methods: {
    // Export scores XLSX
    handleExports(items) {
      // Create worksheet
      const dataWS = XLSX.utils.json_to_sheet(items);
      // Create workbook for export
      const wb = XLSX.utils.book_new();
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, dataWS, "Scores");
      XLSX.writeFile(wb, "export.xlsx");
    }
  }
};
