# 场景规则 03｜Snn 状态编辑

`A01-S01`、`A02-S01` 等是对应基础空间的**图片编辑版**，不是新空间，也不是独立文生图提示词。S 序号在各基础空间内分别递增，不占用 A02 等延展编号。

## 判断是否需要独立状态帧

同一空间、同一画面用途，仅时间、天气、灯光、窗帘或少量可移动剧情物件变化，默认复用基础图。只有以下一种成立，才登记 Snn：该状态在剧本中实际发生且视觉差异对剧情必要、一张底图难以兼容；或用户明确指定独立状态图。不要为每个夜景、转场或小道具变化自动加图。

如果要新机位、新裁切、新透视、新空间结构、移动或更换固定家具、改变永久陈设，**不是 Snn**。再检查它是否真正需要独立功能资产；改变观察方向本身仍不足以新增 A02。

## 两个前提，两个不同动作

| 当前证据 | 可以做 | 不能做 |
| --- | --- | --- |
| 只有基础空间文字提示词，尚无获认可成图 | 登记状态需求、允许变量和等待的基础图 ID | 写成仿佛已锁定某张成图的最终 Snn，或直接编辑 |
| 用户已确认对应基础成图满意，当前尚未重新上传图片 | **预写**该图的 Snn 编辑提示词，明确“实际编辑时使用上传的对应基础图作为唯一图像参考”；不必为了写文字再次索图或看图 | 声称已完成图片编辑；让 Snn 变成独立文生图 |
| 真正执行 Snn 图片编辑 | 上传获认可的对应基础图作为**唯一**视觉参考，再应用编辑提示词 | 用另一张场景图替代，或在无原图时凭文字重建 |

标准顺序：`基础提示词 → 基础成图并获认可 → 可提前预写 Snn 编辑提示词 → 实际编辑时上传对应基础图 → Snn 图片编辑`。

## 锁定项与允许项

编辑提示词明确锁定：基础图的摄影机位置、焦段感和透视、画幅与裁切、构图、空间比例、承重和装修结构、门窗形状、固定家具、永久装饰、材质、既有颜色，以及所有固定物的相对位置。保留该图已确认的视觉风格与 16:9 横构图。

允许项只写本次确需改变的变量：时间、天气、外部自然光、可见灯具开关与色温、同一窗帘的开合或轻微运动，以及少量可移动的临时剧情物件。每个新光源仍写清方向、落点、衰减，阴影和反射随之可信变化。固定物位置一律不变，临时物件只有被变化清单点名时才例外；没有列出的东西保持不变。材质本色不变，允许光照造成符合物理的观感变化。不要用“所有物件绝对不许移动”抵消已允许的窗帘或临时物件变化。

## 编辑提示词骨架

以下是**占位模板**，不是可直接生图的具体资产：

```text
〔A01-S01｜中文大场景｜中文基础空间（状态）〕

Use the uploaded 〔A01〕 approved base image as the sole visual reference. Keep its exact fixed 16:9 framing, camera position, perspective, crop, composition, room proportions, architecture, door and window geometry, built-in elements, fixed furniture, permanent decor, material palette, colors, and every fixed object's position. Preserve the approved 〔photorealistic live-action / stylized 3D animation〕 treatment. Change only 〔confirmed time/weather/light/curtain/temporary object variables〕. The new 〔source〕 enters from 〔direction〕, falls on 〔visible surface〕, and softens toward 〔area〕; adjust related shadows and reflections consistently. 〔Only specified temporary object, if any〕. Do not redesign or rearrange the base room. Keep the scene empty of visible people and reflections of people; no religious imagery or identifiable third-party branding.
```

预写时这段中的 `uploaded` 是**将来实际编辑时的操作指令**，不表示图片已经上传。用该剧真实基础 ID 与已确认状态替换占位符；若当前没有看到基础图，不凭空补写它的具体门窗、家具或色板细节，只通过“锁定原图”保证连续性。执行编辑前确认当前上传的确是用户已认可的那张基础图。
