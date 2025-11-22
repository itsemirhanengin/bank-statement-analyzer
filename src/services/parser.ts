import * as XLSX from "xlsx";

export class ParserService {
  async parseExcel(buffer: ArrayBuffer): Promise<string> {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return JSON.stringify(jsonData, null, 2);
  }
}

export const parserService = new ParserService();
