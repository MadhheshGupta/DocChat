import mammoth from "mammoth";
import { createWorker } from "tesseract.js";
import * as XLSX from "xlsx";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = getExtension(file.name);

  try {
    if (isPdf(file, extension)) {
      return normalizeText(await extractPdfText(file));
    }

    if (isDocx(file, extension)) {
      return normalizeText(await extractDocxText(file));
    }

    if (isSpreadsheet(file, extension)) {
      return normalizeText(await extractSpreadsheetText(file));
    }

    if (isPlainText(extension)) {
      return normalizeText(await readPlainText(file));
    }

    if (isImage(file, extension)) {
      return normalizeText(await extractImageText(file));
    }

    throw new Error(
      `Unsupported file type "${file.type || extension || "unknown"}". Supported formats: PDF, DOCX, XLSX, TXT, MD, PNG, JPG, JPEG, WEBP.`,
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Could not extract text from "${file.name}": ${error.message}`);
    }

    throw new Error(`Could not extract text from "${file.name}".`);
  }
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");

  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");

    pages.push(text);
  }

  return pages.join("\n");
}

async function extractDocxText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractSpreadsheetText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      blankrows: false,
    });
    const plainRows = rows
      .map((row) => row.map((cell) => String(cell ?? "")).join("\t").trim())
      .filter(Boolean)
      .join("\n");

    return `Sheet: ${sheetName}\n${plainRows}`;
  }).join("\n\n");
}

function readPlainText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read plain text file."));
    reader.readAsText(file);
  });
}

async function extractImageText(file: File): Promise<string> {
  const worker = await createWorker("eng");

  try {
    const {
      data: { text },
    } = await worker.recognize(file);

    return text;
  } finally {
    await worker.terminate();
  }
}

function isPdf(file: File, extension: string): boolean {
  return file.type === "application/pdf" || extension === "pdf";
}

function isDocx(file: File, extension: string): boolean {
  return file.type === DOCX_MIME || extension === "docx";
}

function isSpreadsheet(file: File, extension: string): boolean {
  return (
    file.type === XLSX_MIME ||
    file.type === "application/vnd.ms-excel" ||
    extension === "xlsx" ||
    extension === "xls" ||
    extension === "csv"
  );
}

function isPlainText(extension: string): boolean {
  return extension === "txt" || extension === "md";
}

function isImage(file: File, extension: string): boolean {
  return (
    IMAGE_TYPES.has(file.type) ||
    extension === "png" ||
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "webp"
  );
}

function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
