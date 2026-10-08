import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "/Users/Zhuanz/Downloads/女友项目/项目3-捞女/他们都说我是捞女-场景资产表-V2.xlsx";
const workDir = "/Users/Zhuanz/Documents/codex_AI_img/.work/v3_assets";
const outputPath = "/Users/Zhuanz/Documents/codex_AI_img/outputs/捞女-v3-20260919/他们都说我是捞女-场景资产表-V3.xlsx";
const font = "Arial";

await fs.mkdir(workDir, { recursive: true });
const verifyOutput = process.argv.includes("--verify-output");
const input = await FileBlob.load(verifyOutput ? outputPath : sourcePath);
const workbook = await SpreadsheetFile.importXlsx(input);

if (verifyOutput) {
  const summary = await workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 9000,
    tableMaxRows: 5,
    tableMaxCols: 15,
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

if (process.argv.includes("--preview-source")) {
  const summary = await workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 7000,
    tableMaxRows: 6,
    tableMaxCols: 10,
    tableMaxCellChars: 100,
  });
  console.log(summary.ndjson);
  for (const [sheetName, fileName] of [
    ["场景资产总表", "source-overview.png"],
    ["场景明细清单", "source-detail.png"],
  ]) {
    const image = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
    await fs.writeFile(`${workDir}/${fileName}`, new Uint8Array(await image.arrayBuffer()));
  }
  process.exit(0);
}

const assets = [
  ["NY-A01", "纽约", "Adrian 上东区顶层公寓", "客厅／落地窗主空间", "母版＋状态版", "内", 6, "EP01–04、EP12–18", "S", "待审核", "客厅、落地窗、主要沙发与茶几关系固定；保留清晰表演区和进出动线。", "状态：EP01求婚夜；EP01及EP02–04派对夜；EP12–14下午等待；EP17傍晚；EP18普通夜景；多年前暖调回忆。", "V2 01–03、05、48"],
  ["NY-A02", "纽约", "Adrian 上东区顶层公寓", "玄关／入户大门区", "功能空间＋状态版", "内", 3, "EP02、EP04、EP12–14、EP17–18", "S", "待审核", "入户门、玄关柜和客厅方向明确，可支撑推门、离开、门口争执。", "状态：派对夜；下午；傍晚至夜间。只改变时间与少量陈设，不改变门位。", "V2 04"],
  ["NY-S01", "纽约", "Sienna 曼哈顿公寓", "客厅主空间", "母版＋状态版", "内", 2, "EP05、EP07、EP11", "S", "待审核", "比顶层公寓更小、更生活化；客厅与厨房、玄关关系清楚。", "状态：深夜被占用的派对；派对后清理／离开前。避免用过量杂物表现混乱。", "V2 06"],
  ["NY-S02", "纽约", "Sienna 曼哈顿公寓", "厨房水槽／垃圾处理器区", "关键动作模块", "内", 1, "EP05", "S", "待审核", "水槽和垃圾处理器结构真实、动作落点清楚，画面仍能辨认属于同一公寓。", "银色纪念吊坠不得含十字架、圣像或任何宗教符号。", "V2 07"],
  ["NY-S03", "纽约", "Sienna 曼哈顿公寓", "入户门内／楼层走廊衔接区", "功能空间＋状态版", "内", 2, "EP05–07、EP11", "S", "待审核", "一张空间交代门内玄关与门外走廊的对应关系，支撑警察到场和拖行李离开。", "状态：深夜；第二天上午。无需另做住宅大堂或电梯。", "V2 09、11–13"],
  ["NY-M01", "纽约", "公寓大楼物业管理处", "管理处办公室", "独立功能空间", "内", 1, "EP08", "S", "待审核", "普通住宅物业办公室，桌面可放访客记录并留特写位置，办公感真实克制。", "访客记录的可读内容另按道具处理，不要求大空镜承载小字。", "V2 18"],
  ["NY-M02", "纽约", "公寓大楼物业管理处", "办公室门口／相邻走廊", "关键动作模块", "内", 1, "EP08", "A", "待审核", "办公室门与外侧短走廊关系明确，支撑出来后被拦截的动作。", "不拆走廊左右方向，不扩大成物业大堂。", "V2 19"],
  ["NY-O01", "纽约", "公司办公楼", "公司入口／门前街道", "外景主空间", "外", 1, "EP09–10", "S", "待审核", "纽约市中心务实型办公楼入口，台阶、门前停留区和街道纵深在同一画面内。", "一张底板支撑对话、打架、拉开和离开；不另做普通街景。", "V2 14、20"],
  ["NY-C01", "纽约", "赴机场车辆", "轿车乘客区内景", "移动空间", "内", 1, "EP11", "A", "待审核", "从后排或副驾乘客视角看车内与后退的纽约街景，留手机操作空间。", "不用驾驶员第一视角；车型与城市路况符合纽约，不跨城市复用车牌。", "V2 22–23"],
  ["NY-J01", "纽约", "肯尼迪国际机场 JFK", "出发航站楼／登机口综合区", "核心转场空间", "内", 1, "EP11", "S", "待审核", "清楚识别国际机场与登机动线，座位区、通往登机口的路径、垃圾桶同时可用。", "合并值机区、登机口与弃SIM卡动作；无旅客、模糊人影或人形剪影。", "V2 26–28"],
  ["SY-A01", "悉尼", "Sydney 机场", "到达厅／接机出口", "核心转场空间", "内", 1, "EP15", "A", "待审核", "现代国际到达出口、行李动线和接机等候区清晰，具有悉尼机场的当代感。", "无背景人群；接机牌作为人物手持道具另行处理。", "V2 34"],
  ["SY-H01", "悉尼", "公司安排的海边公寓", "客厅／落地窗看海主空间", "母版＋状态版", "内", 4, "EP15–16、EP18", "S", "待审核", "小型海边公寓，结构简单，落地窗外直接见海；空间舒展但不豪宅化。", "状态：白天抵达；傍晚独处；夜间准备上班；次日清晨海面渐亮。卧室和阳台并入此体系。", "V2 36–38"],
  ["SY-O01", "悉尼", "公司办公楼", "高层玻璃会议室／港湾景", "母版＋状态版", "内", 2, "EP19、EP22–24", "S", "待审核", "玻璃隔断、长桌、大屏和一面港湾窗景，满足欢迎汇报、项目结项和投资谈判。", "状态：EP19欢迎花束和彩带；普通商务状态用于EP22–24。桌面文件作为道具变化。", "V2 40、43"],
  ["SY-O02", "悉尼", "公司办公楼", "一楼大堂／玻璃门", "过渡功能空间", "内", 1, "EP19、EP22", "A", "待审核", "大堂尺度适中，玻璃门外能看见台阶和城市傍晚光线，动线清楚。", "可承载经过大堂和前台送花叙述，不新增独立前台房间。", "V2 41"],
  ["SY-O03", "悉尼", "公司办公楼", "门外台阶／CBD人行道／路边等车区", "外景主空间＋状态版", "外", 2, "EP19–21", "S", "待审核", "同一连续外部场地容纳重逢、边走边谈和车旁告别，保留足够步行动线。", "状态：街边无车；同位置有固定轿车停靠。台阶、道路方向和大堂玻璃门一致。", "V2 42、44–45"],
  ["SY-W01", "悉尼", "滨水区项目签约酒会", "酒会大厅／商务宴会区", "独立功能空间", "内", 1, "EP25", "S", "待审核", "克制的现代滨水商务酒会空间，桌椅、签约氛围和局部暖光足够识别功能。", "无宾客或虚化人群；签到区并入，不做巨大复杂宴会厅。", "V2 46–47"],
  ["SY-H02", "悉尼", "Sienna 自购海景住宅", "新购海景小公寓客厅", "结尾独立主空间", "内", 1, "EP25", "S", "待审核", "另一套小型海景公寓，简单、明亮、有属于她自己的生活痕迹，窗外是白天海面。", "建议建立独立空间身份，不做豪宅；可沿用海景公寓的审美体系，但布局和关键家具明显不同。", "V2 39"],
];

const decisions = {
  1:["保留为状态版","NY-A01","EP01明确求婚布置；属于同一客厅的夜间状态。"],
  2:["保留为状态版","NY-A01","EP01及EP02–04派对状态；与求婚状态共用结构。"],
  3:["保留并补状态","NY-A01","保留下午版本，并补EP17傍晚与EP18普通夜景。"],
  4:["保留并合并时间","NY-A02","玄关结构固定，按夜晚、下午、傍晚至夜间做状态版。"],
  5:["并入","NY-A01","落地窗已经是客厅核心结构，不为窗前小机位单独建资产。"],
  6:["保留并补状态","NY-S01","保留深夜派对，并增加清理／离开前状态。"],
  7:["保留且提高优先级","NY-S02","丢弃吊坠是明确关键动作，厨房水槽必须可用。"],
  8:["暂缓","—","卧室没有独立场景硬需求，行李箱可进入客厅或玄关状态。"],
  9:["保留并整合","NY-S03","门内玄关与门外走廊做成可衔接的一套空间。"],
  10:["暂缓","—","离开可由上午玄关接车内完成，无须单做住宅楼外。"],
  11:["并入","NY-S03","无大堂关键动作，住宅门口和走廊已能完成剧情。"],
  12:["并入","NY-S03","警察到场保留在门外走廊，但不作为独立大空间。"],
  13:["暂缓","—","没有电梯关键动作。"],
  14:["保留","NY-O01","EP09–10核心冲突场，需清楚站位与街道纵深。"],
  15:["转证据素材／暂缓","—","加班工位主要作为手机证据，不是主叙事场景。"],
  16:["转证据素材／暂缓","—","门禁记录可由UI或插入镜头处理，无须先做完整大堂。"],
  17:["暂缓","—","老板办公室没有实际内景戏。"],
  18:["保留","NY-M01","EP08关键调查场。"],
  19:["保留并简化","NY-M02","保留办公室门口动作区，不扩展复杂走廊。"],
  20:["并入","NY-O01","与公司楼下属于同一街区和同一连续场景。"],
  21:["并入／暂缓","NY-C01","纽约行车街景可由车内窗外完成，不单做普通车流。"],
  22:["拆归城市场景","NY-C01、SY-O03","车辆按纽约和悉尼分别处理，不跨城市固定同一车牌。"],
  23:["保留并改视角","NY-C01","改为女主乘客区视角，支持电话和车窗动作。"],
  24:["暂缓","—","EP09只说原本去吃饭，没有抵达餐厅。"],
  25:["暂缓","—","剧本没有餐厅内戏。"],
  26:["并入","NY-J01","剧本没有独立值机动作，可并入综合出发／登机区。"],
  27:["保留","NY-J01","走向登机口是离开的关键视觉确认。"],
  28:["并入","NY-J01","垃圾桶作为登机区动作落点，不是独立场景。"],
  29:["暂缓","—","预约过期发生在公寓内叙述，角色没有到达登记处。"],
  30:["暂缓","—","同上，无须登记处外景。"],
  31:["备用转场","—","飞机客舱可在剪辑需要时追加，不进入首轮核心制作。"],
  32:["暂缓","—","纽约和悉尼均无电梯关键动作，且不宜跨城复制建筑。"],
  33:["暂缓","—","剧情落点均为路边和入口，没有车库戏。"],
  34:["保留","SY-A01","EP15抵达与接机明确。"],
  35:["暂缓","—","机场可直接切海边公寓，没有机场外对话。"],
  36:["保留并补状态","SY-H01","核心梦想空间，补白天、傍晚、夜间和清晨。"],
  37:["并入","SY-H01","没有阳台独立动作，落地窗主空间足够。"],
  38:["并入／暂缓","SY-H01","准备资料和清晨看海可在客厅完成，卧室不是硬需求。"],
  39:["重新设计为独立结尾空间","SY-H02","新购住宅应与公司住房可辨识，但保持小型、克制。"],
  40:["保留并合并会议室体系","SY-O01","欢迎、结项、谈判统一同一会议室结构，减少重复资产。"],
  41:["保留","SY-O02","EP19穿过大堂明确，也可承载送花叙述。"],
  42:["保留并整合","SY-O03","与人行道、等车区合成一处连续外部空间。"],
  43:["并入","SY-O01","剧本没有规定必须是另一间会议室，可在初始设计中统一。"],
  44:["并入","SY-O03","边走边谈使用公司外部连续场地。"],
  45:["并入并做状态版","SY-O03","同一场地制作无车和车辆停靠两种状态。"],
  46:["保留","SY-W01","EP25签约酒会是结尾事业兑现的重要场景。"],
  47:["并入","SY-W01","没有签到关键动作，不另做签到区。"],
  48:["并入状态版","NY-A01","多年前回忆复用顶层客厅结构，以暖调状态区分。"],
  49:["暂缓","—","海岸散步是未来梦想描述，不是明确发生过的场景。"],
  50:["暂缓","—","剧本只写冒雨送吊坠，没有明确夜晚或公寓门口。"],
  51:["暂缓","—","只提到手术前，没有医院内戏。"],
};

const sourceDetail = workbook.worksheets.getItem("场景明细清单").getRange("A2:I52").values;
const plan = workbook.worksheets.add("V3制作清单");
const audit = workbook.worksheets.add("V3暂缓合并");

function setCommon(sheet, rangeAddress) {
  sheet.showGridLines = false;
  const range = sheet.getRange(rangeAddress);
  range.format.font = { name: font, size: 10, color: "#172033" };
  range.format.verticalAlignment = "center";
}

plan.getRange("A2").values = [["他们都说我是捞女  场景资产制作清单 V3"]];
plan.getRange("A2").format.font = { name: font, size: 15, bold: true, color: "#172033" };
plan.getRange("A3").values = [["按独立空间建母版；时间、光线和陈设作为状态版。每张图均为16:9无人物空境，禁止宗教元素。"]];
plan.getRange("A3").format.font = { name: font, size: 10, italic: true, color: "#5D667A" };
plan.getRange("A4:K4").values = [["空间资产数", assets.length, null, "预计空镜数", assets.reduce((sum, row) => sum + row[6], 0), null, "目标模型", "GPT Image 2.5 Sunburst", null, "审核状态", "待审核"]];
plan.getRange("A4:K4").format = { fill: "#EEF2F7", font: { name: font, size: 10, bold: true, color: "#172033" } };
plan.getRange("A5").values = [["审核说明：N列选择保留、调整或暂缓；O列填写意见。确认后再推荐第一批，不在本表内提前写提示词。"]];
plan.getRange("A5").format.font = { name: font, size: 10, color: "#5D667A" };

const planHeaders = ["编号","城市","场景系统","实际制作资产","资产类型","内/外","预计图片数","使用集数","优先级","当前状态","空镜设计重点","状态与连续性","V2来源","审核结论","审核意见"];
plan.getRange("A7:O7").values = [planHeaders];
plan.getRange(`A8:O${7 + assets.length}`).values = assets.map(row => [...row, "", ""]);
setCommon(plan, `A7:O${7 + assets.length}`);
plan.getRange("A7:O7").format = { fill: "#24364B", font: { name: font, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#FFFFFF" } };
plan.getRange(`A8:O${7 + assets.length}`).format.wrapText = true;
plan.getRange(`A8:O${7 + assets.length}`).format.verticalAlignment = "top";
plan.getRange(`N8:O${7 + assets.length}`).format.fill = "#FFF4CC";
plan.getRange(`N8:N${7 + assets.length}`).dataValidation = { rule: { type: "list", values: ["保留", "调整", "暂缓"] } };
plan.getRange(`A8:A${7 + assets.length}`).format.font = { name: font, size: 10, bold: true, color: "#24364B" };
plan.getRange(`G8:G${7 + assets.length}`).format.horizontalAlignment = "center";
plan.getRange(`I8:J${7 + assets.length}`).format.horizontalAlignment = "center";
plan.freezePanes.freezeRows(7);
plan.freezePanes.freezeColumns(4);
plan.tabColor = "#24364B";

const planWidths = [76,60,150,170,120,70,78,175,62,78,260,300,120,82,220];
planWidths.forEach((width, i) => plan.getRangeByIndexes(0, i, 1, 1).format.columnWidthPx = width);
plan.getRange("A2:O2").format.rowHeightPx = 26;
plan.getRange("A3:O5").format.rowHeightPx = 22;
plan.getRange("A7:O7").format.rowHeightPx = 42;
plan.getRange(`A8:O${7 + assets.length}`).format.rowHeightPx = 72;

audit.getRange("A2").values = [["V2 场景逐项处理记录"]];
audit.getRange("A2").format.font = { name: font, size: 15, bold: true, color: "#172033" };
audit.getRange("A3").values = [["本表保留V2全部51项的去向。暂缓项不进入当前制作清单，后续分镜确有需要时可追加。"]];
audit.getRange("A3").format.font = { name: font, size: 10, italic: true, color: "#5D667A" };
const auditHeaders = ["V2序号","原大场景体系","原衍生场景","V2必要性","V3处理","对应V3资产","处理理由","审核结论","审核意见"];
audit.getRange("A5:I5").values = [auditHeaders];
const auditRows = sourceDetail.map((row, index) => {
  const id = index + 1;
  const decision = decisions[id];
  return [id, row[1] ?? "", row[2] ?? "", row[6] ?? "", decision[0], decision[1], decision[2], "", ""];
});
audit.getRange("A6:I56").values = auditRows;
setCommon(audit, "A5:I56");
audit.getRange("A5:I5").format = { fill: "#4C6075", font: { name: font, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#FFFFFF" } };
audit.getRange("A6:I56").format.wrapText = true;
audit.getRange("A6:I56").format.verticalAlignment = "top";
audit.getRange("H6:I56").format.fill = "#FFF4CC";
audit.getRange("H6:H56").dataValidation = { rule: { type: "list", values: ["同意", "调整", "恢复制作"] } };
audit.getRange("A6:A56").format.horizontalAlignment = "center";
audit.freezePanes.freezeRows(5);
audit.freezePanes.freezeColumns(3);
audit.tabColor = "#78899A";
const auditWidths = [62,190,190,78,135,115,330,90,230];
auditWidths.forEach((width, i) => audit.getRangeByIndexes(0, i, 1, 1).format.columnWidthPx = width);
audit.getRange("A2:I2").format.rowHeightPx = 26;
audit.getRange("A3:I3").format.rowHeightPx = 22;
audit.getRange("A5:I5").format.rowHeightPx = 42;
audit.getRange("A6:I56").format.rowHeightPx = 58;

workbook.recalculate();

const planCheck = await workbook.inspect({ kind: "table", sheetId: "V3制作清单", range: `A2:O${7 + assets.length}`, include: "values,formulas", tableMaxRows: 30, tableMaxCols: 15, maxChars: 15000 });
const auditCheck = await workbook.inspect({ kind: "table", sheetId: "V3暂缓合并", range: "A2:I56", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 9, maxChars: 6000 });
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(planCheck.ndjson);
console.log(auditCheck.ndjson);
console.log(errors.ndjson);

for (const [sheetName, fileName] of [
  ["V3制作清单", "v3-production.png"],
  ["V3暂缓合并", "v3-audit.png"],
]) {
  const image = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${workDir}/${fileName}`, new Uint8Array(await image.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, spaces: assets.length, images: assets.reduce((sum, row) => sum + row[6], 0), auditRows: auditRows.length }));
