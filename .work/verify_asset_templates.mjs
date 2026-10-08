import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const files = [
  "/Users/Zhuanz/Documents/codex_AI_img/模板/新剧目/03_角色资产表.xlsx",
  "/Users/Zhuanz/Documents/codex_AI_img/模板/新剧目/05_道具资产表.xlsx",
];

for (const path of files) {
  const input = await FileBlob.load(path);
  const workbook = await SpreadsheetFile.importXlsx(input);
  const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 3000 });
  const errors = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
    options: { useRegex: true, maxResults: 100 },
    summary: "formula error scan",
  });
  console.log(path);
  console.log(sheets.ndjson);
  console.log(errors.ndjson);
}
