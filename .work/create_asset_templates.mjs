import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "/Users/Zhuanz/Documents/codex_AI_img";
const outputDir = `${root}/模板/新剧目`;
const previewDir = `${root}/.work/template_previews`;
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const fontName = "Arial";
const headerFill = "#D9E5F6";
const headerText = "#E53935";
const bodyFill = "#FFFFFF";
const keyFill = "#E8EDF3";
const borderColor = "#C8CDD4";

function styleSheet(sheet, rangeAddress, widths, bodyRows = 8) {
  sheet.showGridLines = false;
  const used = sheet.getRange(rangeAddress);
  used.format.font = { name: fontName, size: 11, color: "#171717" };
  used.format.verticalAlignment = "center";
  used.format.borders = { preset: "all", style: "thin", color: borderColor };
  used.format.wrapText = true;

  const colCount = widths.length;
  const header = sheet.getRangeByIndexes(0, 0, 1, colCount);
  header.format.fill = headerFill;
  header.format.font = { name: fontName, size: 11, bold: true, color: headerText };
  header.format.horizontalAlignment = "center";
  header.format.rowHeightPx = 36;

  const body = sheet.getRangeByIndexes(1, 0, bodyRows, colCount);
  body.format.fill = bodyFill;
  body.format.rowHeightPx = 112;

  sheet.getRangeByIndexes(1, 0, bodyRows, 1).format.fill = keyFill;
  sheet.getRangeByIndexes(1, 0, bodyRows, 1).format.font = { name: fontName, size: 11, bold: true, color: "#171717" };

  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, bodyRows + 1, 1).format.columnWidthPx = width;
  });
}

async function buildCharacterWorkbook() {
  const workbook = Workbook.create();
  const characters = workbook.worksheets.add("主要角色");
  characters.getRange("A1:J9").values = [
    ["角色名称", "人脸参考", "服装01名称", "图片", "服装02名称", "图片", "服装03名称", "图片", "服装04名称", "图片"],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ];
  styleSheet(characters, "A1:J9", [190, 170, 190, 170, 190, 170, 190, 170, 190, 170]);
  characters.tabColor = "#5B9BD5";

  const extras = workbook.worksheets.add("群演与功能角色");
  extras.getRange("A1:C9").values = [
    ["群演／功能角色组名称", "人数与构成", "图片"],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  styleSheet(extras, "A1:C9", [260, 260, 230]);
  extras.tabColor = "#A5A5A5";

  workbook.recalculate();
  const inspection = await workbook.inspect({ kind: "sheet,table", maxChars: 4000, tableMaxRows: 4, tableMaxCols: 10 });
  console.log(inspection.ndjson);
  const p1 = await workbook.render({ sheetName: "主要角色", range: "A1:J4", scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/character_assets.png`, new Uint8Array(await p1.arrayBuffer()));
  const p2 = await workbook.render({ sheetName: "群演与功能角色", range: "A1:C4", scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/extras_assets.png`, new Uint8Array(await p2.arrayBuffer()));
  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(`${outputDir}/03_角色资产表.xlsx`);
}

async function buildPropWorkbook() {
  const workbook = Workbook.create();
  const sheet = workbook.worksheets.add("道具资产");
  sheet.getRange("A1:C13").values = [
    ["道具编号", "道具名称／剧情状态", "图片"],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  styleSheet(sheet, "A1:C13", [150, 330, 250], 12);
  sheet.tabColor = "#ED7D31";

  workbook.recalculate();
  const inspection = await workbook.inspect({ kind: "sheet,table", maxChars: 3000, tableMaxRows: 5, tableMaxCols: 4 });
  console.log(inspection.ndjson);
  const preview = await workbook.render({ sheetName: "道具资产", range: "A1:C5", scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/prop_assets.png`, new Uint8Array(await preview.arrayBuffer()));
  const output = await SpreadsheetFile.exportXlsx(workbook);
  await output.save(`${outputDir}/05_道具资产表.xlsx`);
}

await buildCharacterWorkbook();
await buildPropWorkbook();
