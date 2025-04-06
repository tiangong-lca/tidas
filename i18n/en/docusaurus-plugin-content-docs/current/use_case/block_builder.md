---
sidebar_position: 2
description: Detailed case study on how HiQ-Editor tool from Haike Data integrates with and uses TIDAS data architecture
---

# HiQ-Editor and TIDAS Integration Case Study

## Overview

The integration between HiQ-Editor and TIDAS is significant because:

- It enables easier LCA data exchange for users like enterprises, research institutions and governments, allowing environmental impact assessments using global data while ensuring data universality and comparability.
- It facilitates LCA data (like ELCD, HiQLCD) interaction across different platforms, preventing data silos and improving interoperability.
- Using unified data structure and quality requirements makes LCA data more standardized, transparent and traceable, ensuring data integrity and consistency while improving reliability.

## Prerequisites

- TIDAS account permissions
- Basic TIDAS schema knowledge
- HiQ-Editor account permissions

## Data Integration Methods

HiQ-Editor integrates with TIDAS primarily through:

1. ILCD format import/export to support data flow between systems
2. API interfaces for data review and transfer

## Integration Steps

### Data Import/Export

1. Users (editors) edit data in HiQ-Editor.
![image](https://github.com/user-attachments/assets/1652763e-0388-49f7-8edd-54e86a2f6aee)
2. Users (managers) perform LCIA calculations on a data version in HiQ-Editor and publish it.
3. Users select data to export - system parses HiQ-Editor's LCA data schema and exports as ILCD-compliant document.
4. Users import and parse the ILCD document in TIDAS system.
![image](https://github.com/user-attachments/assets/146de387-f375-4019-8139-21c1cb534bab)

### Data Review and Transfer

1. Users (editors) edit data in HiQ-Editor and submit for review.
2. HiQ-Editor establishes API connection with TIDAS to verify access permissions.
3. Submitted data flows to TIDAS for review via integration interface.
4. Users (reviewers) review and validate data in TIDAS system, with support for returning review content/results to HiQ-Editor.

## Example Scenario

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

## FAQs

### Q1: What if data submitted from HiQ-Editor cannot be transferred to TIDAS?

A: Check if the data in HiQ-Editor has passed completeness validation and its calculation status - only calculated data can be transferred to TIDAS for review.

### Q2: What if some field information is missing after export?

A: HiQ-Editor export follows ILCD format standards - fields specific to custom business requirements that aren't part of ILCD specifications won't be included in the export.
