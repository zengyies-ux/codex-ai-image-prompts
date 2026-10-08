import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workDir = "/Users/Zhuanz/Documents/codex_AI_img/.work/scene_template";
const outputPath = "/Users/Zhuanz/Documents/codex_AI_img/模板/新剧目/01_场景资产主表.xlsx";
const font = "Arial";

await fs.mkdir(workDir, { recursive: true });

if (process.argv.includes("--verify-output")) {
  const input = await FileBlob.load(outputPath);
  const workbook = await SpreadsheetFile.importXlsx(input);
  const summary = await workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 6000,
    tableMaxRows: 6,
    tableMaxCols: 11,
    tableMaxCellChars: 100,
  });
  const errors = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
    options: { useRegex: true, maxResults: 100 },
    summary: "saved workbook formula error scan",
  });
  console.log(summary.ndjson);
  console.log(errors.ndjson);
  process.exit(0);
}

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("场景资产总表");
sheet.showGridLines = false;

const headers = [
  "大场景名称",
  "衍生场景01名称", "图片",
  "衍生场景02名称", "图片",
  "衍生场景03名称", "图片",
  "衍生场景04名称", "图片",
  "衍生场景05名称", "图片",
];
sheet.getRange("A1:K1").values = [headers];
sheet.getRange("A1:K1").format = {
  fill: "#DCE8F7",
  font: { name: font, size: 11, bold: true, color: "#F02B1D" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#B9CBE2" },
};

const blankRows = Array.from({ length: 24 }, () => Array(11).fill(""));
sheet.getRange("A2:K25").values = blankRows;
sheet.getRange("A2:K25").format = {
  font: { name: font, size: 10, color: "#111827" },
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#C9D7E8" },
};
sheet.getRange("A2:A25").format.fill = "#F1F1F1";
sheet.getRange("B2:B25").format.fill = "#F7F7F7";
sheet.getRange("D2:D25").format.fill = "#F7F7F7";
sheet.getRange("F2:F25").format.fill = "#F7F7F7";
sheet.getRange("H2:H25").format.fill = "#F7F7F7";
sheet.getRange("J2:J25").format.fill = "#F7F7F7";

sheet.getRange("A1:K1").format.rowHeightPx = 34;
sheet.getRange("A2:K25").format.rowHeightPx = 132;
sheet.getRange("A:A").format.columnWidthPx = 250;
for (const col of ["B", "D", "F", "H", "J"]) {
  sheet.getRange(`${col}:${col}`).format.columnWidthPx = 185;
}
for (const col of ["C", "E", "G", "I", "K"]) {
  sheet.getRange(`${col}:${col}`).format.columnWidthPx = 200;
}

sheet.freezePanes.freezeRows(1);
sheet.freezePanes.freezeColumns(1);
sheet.tabColor = "#7CA8D8";

workbook.recalculate();

const check = await workbook.inspect({
  kind: "table",
  sheetId: "场景资产总表",
  range: "A1:K8",
  include: "values,formulas",
  tableMaxRows: 8,
  tableMaxCols: 11,
  maxChars: 6000,
});
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(check.ndjson);
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "场景资产总表",
  range: "A1:K6",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${workDir}/simple-scene-assets.png`, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, sheet: "场景资产总表", rows: 24, sceneSlots: 5 }));
