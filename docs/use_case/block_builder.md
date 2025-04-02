---
sidebar_position: 2
title: 易碳数科HiQ-Editor与TIDAS集成案例
description: 易碳数科HiQ-Editor工具如何集成和使用TIDAS数据架构的详细案例
---

# 易碳数科HiQ-Editor与TIDAS集成案例

## 概述

易碳数科HiQ-Editor与TIDAS集成,并实现无缝对接具有重要意义：
- HiQ-Editor与TIDAS集成可以使工具的使用者，如企业、研究机构和政府能够更方便地交换LCA数据，并使用全球范围内的数据进行环境影响评估，确保数据的通用性和可比性。
- HiQ-Editor与TIDAS集成也意味着LCA数据（如 ELCD、HiQLCD）可以在不同平台进行交互，避免数据孤岛，提高互操作性。
- HiQ-Editor与TIDAS采用统一的数据结构和质量要求，使LCA数据更加规范、透明和可追溯，可确保数据的完整性和一致性，提高数据可靠性。

## 前置条件

- TIDAS账户权限要求
- 需要了解的TIDAS schema知识
- HiQ-Editor账户权限要求

## 数据接入

HiQ-Editor与TIDAS集成主要有以下两种方式
1. 基于ILCD格式的导入与导出，以支持数据在不同系统中的流转和使用
2. 基于API接口进行数据审核与流转

## 具体集成步骤

- 数据导入与导出
1. 用户（编辑人员）在HiQ-Editor中编辑数据。
![image](https://github.com/user-attachments/assets/1652763e-0388-49f7-8edd-54e86a2f6aee)
3. 用户（管理人员）在HiQ-Editor中对某一版本的数据进行LCIA计算，并发布。
4. 用户选择需要导出的数据，系统解析HiQ-Editor的LCA数据schema，将其导出为符合ILCD格式的文档。
5. 用户在TIDAS系统中将ILCD文档解析并导入。
![image](https://github.com/user-attachments/assets/146de387-f375-4019-8139-21c1cb534bab)


- 数据审核与流转
1. 用户（编辑人员）在HiQ-Editor中编辑数据，并提交审核。
2. HiQ-Editor与TIDAS建立API连接，验证访问权限。
3. 通过集成接口，提交审核的数据流转至TIDAS进行审核。
4. 用户（审核人员）在TIDAS系统中对数据进行审核与校验，并支持将审核内容与结果回传至HiQ-Editor。

## 示例场景

```json
{
  "processInformation": {
    "dataSetInformation": {
      "common:UUID": "ffea4eb0-bd87-4d20-bd17-9928865401bb",
      "name": {
        "baseName": [
          {
            "#text": "钢坯 ,Q235B,混合技术",
            "@xml:lang": "zh"
          },
          {
            "#text": "steel billet, Q235B, mixed technology | market | cut off",
            "@xml:lang": "en"
          }
        ]
      },
      "classificationInformation": {
        "common:classification": {
          "common:class": {
            "id": [
              "C",
              "24",
              "241",
              "2410"
            ],
            "value": [
              "Manufacturing",
              "Manufacture of basic metals",
              "Manufacture of basic iron and steel",
              "Manufacture of basic iron and steel"
            ]
          }
        }
      },
      "common:generalComment": [
        {
          "#text": "该数据集为市场数据集，代表该区域的消费市场，数据集包括产品从大门到消费端的运输，运输服务根据该区域该产品的运输情况进行计算。钢坯可作为下游工艺的原料，经过轧制、锻造、拉拔等加工工艺，制成各种规格和形状的成品钢材，如钢板、钢管、钢棒等。在建筑、机械制造、船舶制造、汽车制造等领域，钢坯广泛用于制造各种零部件和结构材料。Q235钢是一种常用的碳素结构钢，具有良好的可焊性、塑性和冷弯成形性能。该数据集通过多个来源的数据合并形成。",
          "@xml:lang": "zh"
        },
        {
          "#text": "This dataset is a market dataset, representing the consumption market in the region. The dataset includes the transportation of products from the gate to the consumption end, and the transportation service is calculated based on the transportation conditions of the product in the region. Steel billet can be used as raw material for downstream processes, and after processing technologies such as rolling, forging, and wire drawing, it is made into finished steel products in various specifications and shapes such as steel plates, steel pipes, and steel bars. In the fields of construction, machinery manufacturing, shipbuilding, and automobile manufacturing, steel billets are widely used to manufacture various components and structural materials. Q235 steel is a commonly used carbon steel with good weldability, ductility, and cold bending forming properties. The dataset was formed by aggregating data from multiple sources.",
          "@xml:lang": "en"
        }
      ]
    },
    "time": {
      "common:referenceYear": "2022"
    },
    "geography": {
      "locationOfOperationSupplyOrProduction": {
        "@location": "CN-HL"
      }
    },
    "technology": {
      "technologyDescriptionAndIncludedProcesses": [
        {
          "#text": "钢铁冶炼工艺主要包括转炉炼钢技术和电炉炼钢技术。转炉炼钢是一种常见的钢铁冶炼工艺，在冶炼过程中，通过高温燃烧和氧气吹炼，去除钢水中的杂质，如硫、磷等。通过控制氧气的吹入量和生产时间，调节炉内的氧气气氛和反应条件，从而控制合金的成分和质量。随后将熔化精炼后的钢水经钢包运至回转台，回转台转动到浇注位置后，将钢水注入中间包，中间包再由水口将钢水分配到各个结晶器中，经过冷却凝固后形成成型的粗钢坯料。电弧炉炼钢是利用电弧的热效应加热炉料进行熔炼的炼钢方法。通过石墨电极向电弧炼钢炉内输入电能，以电极端部和炉料之间发生的电弧为热源进行炼钢。电弧炉炼钢以废钢为主要原料，合金、石灰、增碳剂等为辅助原料。电弧炉炼钢的基本工艺包括扒渣补炉、装入金属炉料、送电、熔化、氧化、还原精炼和出钢等。此单元过程电炉炼钢的废钢比约40%。",
          "@xml:lang": "zh"
        },
        {
          "#text": "Steelmaking technologies primarily include converter steelmaking technology and EAF steelmaking technology. Converter steelmaking is a common technology in the field, wherein the refining process, high-temperature combustion and oxygen blowing is used to remove impurities from the molten steel, such as sulfur, phosphorus, etc. By controlling the amount of oxygen blown and the production time, the oxygen atmosphere within the furnace and the reaction conditions are regulated to control the composition and quality of the alloyed steel. Molten refined steel is subsequently transported to a rotating platform via a ladle. Once the platform rotates to the casting position, the molten steel is poured into a tundish, from which the steel is distributed via spout to multiple crystallizers. After cooling and solidification, these form shaped crude steel billets. Electric arc furnace steelmaking is a steelmaking method that uses the thermal effect of electric arcs to heat and smelt furnace materials. Electrical energy is input into the electric arc furnace through graphite electrodes, using the electric arc between the electrode tip and furnace material as the heat source for steelmaking. Electric arc furnace steelmaking primarily uses scrap steel as the main raw material, with alloy, limestone, and carbon enhancers used as auxiliary materials. The basic process of electric arc furnace steelmaking includes slag removal and furnace supplementation, loading of metallic furnace materials, power feeding, melting, oxidation, reduction refining, and steel tapping. In this unit process, the scrap steel ratio of electric arc furnace steelmaking is approximately 40%.",
          "@xml:lang": "en"
        }
      ],
      "technologicalApplicability": [
        {
          "#text": "钢铁冶炼工艺主要包括转炉炼钢技术和电炉炼钢技术。转炉炼钢是一种常见的钢铁冶炼工艺，在冶炼过程中，通过高温燃烧和氧气吹炼，去除钢水中的杂质，如硫、磷等。通过控制氧气的吹入量和生产时间，调节炉内的氧气气氛和反应条件，从而控制合金的成分和质量。随后将熔化精炼后的钢水经钢包运至回转台，回转台转动到浇注位置后，将钢水注入中间包，中间包再由水口将钢水分配到各个结晶器中，经过冷却凝固后形成成型的粗钢坯料。电弧炉炼钢是利用电弧的热效应加热炉料进行熔炼的炼钢方法。通过石墨电极向电弧炼钢炉内输入电能，以电极端部和炉料之间发生的电弧为热源进行炼钢。电弧炉炼钢以废钢为主要原料，合金、石灰、增碳剂等为辅助原料。电弧炉炼钢的基本工艺包括扒渣补炉、装入金属炉料、送电、熔化、氧化、还原精炼和出钢等。此单元过程电炉炼钢的废钢比约40%。",
          "@xml:lang": "zh"
        },
        {
          "#text": "Steelmaking technologies primarily include converter steelmaking technology and EAF steelmaking technology. Converter steelmaking is a common technology in the field, wherein the refining process, high-temperature combustion and oxygen blowing is used to remove impurities from the molten steel, such as sulfur, phosphorus, etc. By controlling the amount of oxygen blown and the production time, the oxygen atmosphere within the furnace and the reaction conditions are regulated to control the composition and quality of the alloyed steel. Molten refined steel is subsequently transported to a rotating platform via a ladle. Once the platform rotates to the casting position, the molten steel is poured into a tundish, from which the steel is distributed via spout to multiple crystallizers. After cooling and solidification, these form shaped crude steel billets. Electric arc furnace steelmaking is a steelmaking method that uses the thermal effect of electric arcs to heat and smelt furnace materials. Electrical energy is input into the electric arc furnace through graphite electrodes, using the electric arc between the electrode tip and furnace material as the heat source for steelmaking. Electric arc furnace steelmaking primarily uses scrap steel as the main raw material, with alloy, limestone, and carbon enhancers used as auxiliary materials. The basic process of electric arc furnace steelmaking includes slag removal and furnace supplementation, loading of metallic furnace materials, power feeding, melting, oxidation, reduction refining, and steel tapping. In this unit process, the scrap steel ratio of electric arc furnace steelmaking is approximately 40%.",
          "@xml:lang": "en"
        }
      ]
    }
  },
  "modellingAndValidation": {
    "LCIMethodAndAllocation": {
      "typeOfDataSet": "LCI result",
      "LCIMethodPrinciple": "Other"
    }
  },
  "administrativeInformation": {
    "dataGenerator": {
      "common:referenceToPersonOrEntityGeneratingTheDataSet": {
        "@refObjectId": "3d81d33c-3958-372e-b8a8-18fa35035231",
        "@type": "contact data set",
        "@uri": "../contacts/3d81d33c-3958-372e-b8a8-18fa35035231.xml"
      }
    },
    "dataEntryBy": {
      "common:timeStamp": "2024-12-31T13:03:35.762+08:00",
      "common:referenceToDataSetFormat": {
        "@refObjectId": "a97a0155-0234-4b87-b4ce-a45da52f2a40",
        "@type": "source data set",
        "@uri": "../sources/a97a0155-0234-4b87-b4ce-a45da52f2a40_01.01.000.xml",
        "@version": "01.01.000",
        "common:shortDescription": [
          {
            "#text": "ILCD format",
            "@xml:lang": "zh"
          }
        ]
      },
      "common:referenceToConvertedOriginalDataSetFrom": {},
      "common:referenceToPersonOrEntityEnteringTheData": {
        "@refObjectId": "3d81d33c-3958-372e-b8a8-18fa35035231",
        "@type": "contact data set",
        "@uri": "../contacts/3d81d33c-3958-372e-b8a8-18fa35035231.xml"
      },
      "common:referenceToDataSetUseApproval": {}
    },
    "publicationAndOwnership": {
      "common:dateOfLastRevision": "2024-12-15T15:02:45.862+08:00",
      "common:dataSetVersion": "01.01.000",
    }
  },
  "id": "ffea4eb0-bd87-4d20-bd17-9928865401bb",
  "exchanges": {
    "exchange": []
  }
}
```

## 常见问题

### Q1: HiQ-Editor提交审核的数据无法流转至TIDAS怎么办？

A: 请检查HiQ-Editor中数据的完整性是否通过校验，以及数据集的计算状态，只有已计算的数据才能流转至TIDAS进行审核

### Q2: 导出后部分字段信息缺失怎么办？

A: HiQ-Editor的导出是基于ILCD的格式标准进行导出的，一些个性化业务需求的字段并不在ILCD的要求内，因此不参与导出
