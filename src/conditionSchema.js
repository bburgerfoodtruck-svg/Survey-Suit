export const CONDITION_SCHEMA = {
  "title": "PAS 2035 Condition Report",
  "version": "1.0.1",
  "sections": [
    {
      "id": "general",
      "title": "1. General Information",
      "items": [
        {
          "id": "assessorNameId",
          "label": "Assessor Name & ID",
          "type": "text",
          "required": true
        },
        {
          "id": "inspectionDate",
          "label": "Inspection Date",
          "type": "date",
          "required": true
        },
        {
          "id": "houseType",
          "label": "House Type",
          "type": "select",
          "options": [
            "House",
            "Bungalow",
            "Flat",
            "Maisonette",
            "Other"
          ],
          "required": true,
          "allowOther": true
        },
        {
          "id": "classificationType",
          "label": "Classification Type",
          "type": "select",
          "options": [
            "Detached",
            "Semi-detached",
            "Mid-terrace",
            "End-terrace",
            "Purpose-built",
            "Converted",
            "Other"
          ],
          "required": false,
          "allowOther": true
        },
        {
          "id": "orientationFront",
          "label": "Orientation (front elevation)",
          "type": "select",
          "options": [
            "N",
            "NE",
            "E",
            "SE",
            "S",
            "SW",
            "W",
            "NW",
            "Unknown"
          ],
          "required": false
        },
        {
          "id": "orientationDegrees",
          "label": "Orientation in degrees (front elevation)",
          "type": "number",
          "required": false
        },
        {
          "id": "exposureZone",
          "label": "Exposure Zone",
          "type": "text",
          "required": false
        },
        {
          "id": "mainWallConstruction",
          "label": "Main Wall Construction",
          "type": "select",
          "options": [
            "Solid",
            "Cavity",
            "Timber frame",
            "System build",
            "Other"
          ],
          "required": true,
          "allowOther": true
        },
        {
          "id": "traditionalBuildProtected",
          "label": "Is the building traditional (pre 1919) or Protected/Listed/Conservation/AONB? If yes: Significance Survey required.",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "materialType",
          "label": "Material Type",
          "type": "text",
          "required": false
        },
        {
          "id": "visibleWallInsulation",
          "label": "Are there any visible signs of existing wall insulation?",
          "type": "yesno",
          "required": true
        },
        {
          "id": "bridgeDpc",
          "label": "Does the existing ground level on any elevation bridge the DPC?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        }
      ]
    },
    {
      "id": "access",
      "title": "2.1 Property Access",
      "items": [
        {
          "id": "roadRestrictions",
          "label": "Are there any road (height/width/weight) restrictions in the locality?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "onStreetParking",
          "label": "Is on-street parking available?",
          "type": "yesno",
          "required": true,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "overheadWires",
          "label": "Are there any overhead wires or cables?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "accessGated",
          "label": "Is the access gated?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "restrictedWallAccess",
          "label": "Is there restricted space for contractors to access the wall area?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "restrictedRoofAccess",
          "label": "Is there restricted space for contractors to access the roof area?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "gableClearance",
          "label": "Is there more than 1.5m in width to fence or neighbouring boundary along the full gable elevation?",
          "type": "yesno",
          "required": true,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "rearGinnel",
          "label": "Is access to the rear provided by use of a ginnel?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "rearAlley",
          "label": "Is access to the rear provided by use of a secured alleyway?",
          "type": "yesno",
          "required": false
        }
      ]
    },
    {
      "id": "elevations",
      "title": "2.2 External Elevations",
      "items": [
        {
          "id": "elevFront_structDefects",
          "label": "Front elevation: Structural defects of elevation",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "elevFront_needResolve",
          "label": "Front elevation: Does any structural defect need resolving before retrofit?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "elevFront_waterPen",
          "label": "Front elevation: Signs of water penetration (failed rainwater goods/pipework)?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "elevFront_movement",
          "label": "Front elevation: Signs of movement?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "elevFront_cracking",
          "label": "Front elevation: Signs of cracking to external finish?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "elevOther_sameAsFront",
          "label": "Do all answers for the Front Elevation also apply to other elevations (condition/insulation/water penetration/movement/cracking)?",
          "type": "yesno",
          "required": true
        },
        {
          "id": "elevFourth",
          "label": "Is there a 4th external elevation?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "elevEvidence",
          "label": "External elevations evidence photo(s)",
          "type": "photos",
          "required": true,
          "minPhotos": 1
        }
      ]
    },
    {
      "id": "conservatory",
      "title": "2.3 Conservatory / Outbuilding",
      "items": [
        {
          "id": "hasConservatory",
          "label": "Is there a Conservatory?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "hasCellar",
          "label": "Is there a cellar present?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "hasOutbuilding",
          "label": "Is there an Outbuilding?",
          "type": "yesno",
          "required": false
        }
      ]
    },
    {
      "id": "rooms",
      "title": "3. Rooms",
      "items": [
        {
          "id": "roomHallway",
          "label": "Is there a hallway?",
          "type": "yesno",
          "required": true
        },
        {
          "id": "living_condition",
          "label": "Living Room: Overall condition of the room",
          "type": "rag",
          "required": true,
          "options": [
            "Green",
            "Amber",
            "Red"
          ]
        },
        {
          "id": "living_defects",
          "label": "Living Room: Any defects? (moisture damage, cracking etc.)",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "living_windows",
          "label": "Living Room: Does the room have any windows?",
          "type": "yesno",
          "required": true
        },
        {
          "id": "living_vent",
          "label": "Living Room: Is there a ventilation system present?",
          "type": "yesno",
          "required": true
        },
        {
          "id": "living_damp",
          "label": "Living Room: Visible/reported damp, mould or excessive condensation?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true,
          "photoRequiredIfYes": true
        },
        {
          "id": "living_undercuts",
          "label": "Living Room: Sufficient undercuts on closed door (threshold min 10mm)?",
          "type": "yesno",
          "required": true,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "living_openFlue",
          "label": "Living Room: Any open flue heating appliances?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "hasDining",
          "label": "Is there a dining room?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "kitchen_condition",
          "label": "Kitchen: Overall condition of the room",
          "type": "rag",
          "required": true,
          "options": [
            "Green",
            "Amber",
            "Red"
          ]
        },
        {
          "id": "kitchen_defects",
          "label": "Kitchen: Any defects? (moisture damage, cracking etc.)",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "kitchen_windows",
          "label": "Kitchen: Does the room have any windows?",
          "type": "yesno",
          "required": true
        },
        {
          "id": "kitchen_vent",
          "label": "Kitchen: Is there a ventilation system present?",
          "type": "yesno",
          "required": true,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "kitchen_hood",
          "label": "Kitchen: Is there a cooker hood present?",
          "type": "yesno",
          "required": true
        },
        {
          "id": "kitchen_damp",
          "label": "Kitchen: Visible/reported damp, mould or excessive condensation?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true,
          "photoRequiredIfYes": true
        },
        {
          "id": "kitchen_undercuts",
          "label": "Kitchen: Sufficient undercuts on closed door (threshold min 10mm)?",
          "type": "yesno",
          "required": true,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "kitchen_openFlue",
          "label": "Kitchen: Any open flue heating appliances?",
          "type": "yesno",
          "required": true,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "hasUtility",
          "label": "Is there a utility room?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "hasWC",
          "label": "Is there a separated WC?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "hasLanding",
          "label": "Is there a landing?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "loftAccessible",
          "label": "Is the main loft space accessible?",
          "type": "yesno",
          "required": false,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "moreThanOneLoft",
          "label": "Is there more than one loft space? (e.g., above extension)",
          "type": "yesno",
          "required": false
        },
        {
          "id": "hasRoomInRoof",
          "label": "Is there a room in roof?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "floorplanNote",
          "label": "Please add location of door undercuts to floorplan (note)",
          "type": "text",
          "required": false
        }
      ]
    },
    {
      "id": "heating",
      "title": "4. Heating System",
      "items": [
        {
          "id": "heatingWorking",
          "label": "Is the heating system in working order?",
          "type": "yesno",
          "required": true,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "smartMeter",
          "label": "Does the occupant have a Smart Meter?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "smartMonitoring",
          "label": "Any smart monitoring devices (Switchee etc)?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "gasMeterAccessible",
          "label": "Is the gas meter accessible?",
          "type": "yesno",
          "required": false,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "elecMeterAccessible",
          "label": "Is the electricity meter accessible?",
          "type": "yesno",
          "required": false,
          "flagOn": "no",
          "actionRequired": true
        },
        {
          "id": "mainHeating1Fuel",
          "label": "Main Heating 1 \u2013 Fuel",
          "type": "text",
          "required": false
        },
        {
          "id": "hasMainHeating2",
          "label": "Is there a Main Heating 2?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "hasSecondaryHeating",
          "label": "Is there a Secondary Heating?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "roomsHeatedBy1",
          "label": "Rooms heated by Main System 1",
          "type": "text",
          "required": false
        },
        {
          "id": "roomsHeatedBy2",
          "label": "Rooms heated by Main System 2",
          "type": "text",
          "required": false
        },
        {
          "id": "roomsHeatedBySecondary",
          "label": "Rooms heated by Secondary Heating",
          "type": "text",
          "required": false
        },
        {
          "id": "partiallyHeated",
          "label": "Are there any partially heated rooms?",
          "type": "yesno",
          "required": false,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "unheatedRooms",
          "label": "Are there any unheated rooms?",
          "type": "yesno",
          "required": false,
          "flagOn": "yes",
          "actionRequired": true
        },
        {
          "id": "renewables",
          "label": "Is there any renewable energy system in place?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "roofOrientationPV",
          "label": "Suitable roof orientation for Solar PV/water",
          "type": "select",
          "options": [
            "Yes",
            "No",
            "Unknown"
          ],
          "required": false
        },
        {
          "id": "waterTank",
          "label": "Is there a Water Tank?",
          "type": "yesno",
          "required": false
        }
      ]
    },
    {
      "id": "occupancy",
      "title": "5. Occupancy Assessment",
      "items": [
        {
          "id": "totalOccupants",
          "label": "Total number of occupants",
          "type": "number",
          "required": false
        },
        {
          "id": "tenure",
          "label": "Property tenure",
          "type": "select",
          "options": [
            "Owner occupied",
            "Private rented",
            "Social rented",
            "Other"
          ],
          "required": false,
          "allowOther": true
        },
        {
          "id": "billPayer",
          "label": "Who is the electricity bill payer?",
          "type": "select",
          "options": [
            "Occupant",
            "Landlord",
            "Inclusive rent",
            "Unknown",
            "Other"
          ],
          "required": false,
          "allowOther": true
        },
        {
          "id": "roomStatTemp",
          "label": "Room Stat Temperature (\u00b0C)",
          "type": "number",
          "required": false
        },
        {
          "id": "roomStatLocation",
          "label": "Room Stat Location",
          "type": "text",
          "required": false
        },
        {
          "id": "heatingPatternKnown",
          "label": "Is the heating pattern known?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "showerType",
          "label": "Shower Type",
          "type": "select",
          "options": [
            "Electric",
            "Mixer",
            "Power",
            "Unknown",
            "Other"
          ],
          "required": false,
          "allowOther": true
        },
        {
          "id": "showersFreq",
          "label": "Number of showers per day/week (if known)",
          "type": "text",
          "required": false
        },
        {
          "id": "bathsFreq",
          "label": "Number of baths per day/week (if known)",
          "type": "text",
          "required": false
        },
        {
          "id": "numFridges",
          "label": "No. of standalone fridges",
          "type": "number",
          "required": false
        },
        {
          "id": "numFreezers",
          "label": "No. of standalone freezers",
          "type": "number",
          "required": false
        },
        {
          "id": "numFridgeFreezers",
          "label": "No. of standalone or integrated fridge freezers",
          "type": "number",
          "required": false
        },
        {
          "id": "cookerType",
          "label": "Cooker type",
          "type": "select",
          "options": [
            "Electric",
            "Gas",
            "Dual fuel",
            "Range",
            "Other",
            "Unknown"
          ],
          "required": false,
          "allowOther": true
        },
        {
          "id": "cookerSize",
          "label": "Normal / Large / Range",
          "type": "select",
          "options": [
            "Normal",
            "Large",
            "Range",
            "Unknown"
          ],
          "required": false
        },
        {
          "id": "rangeFuel",
          "label": "Range fuel (if applicable)",
          "type": "text",
          "required": false
        },
        {
          "id": "tumbleDryer",
          "label": "Tumble dryer present?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "annualUsePct",
          "label": "Percentage of annual use (if known)",
          "type": "text",
          "required": false
        },
        {
          "id": "outdoorDryingSpace",
          "label": "Space for outdoor drying?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "evidencedBills",
          "label": "Have you evidenced 12 months of fuel bill data?",
          "type": "yesno",
          "required": false
        },
        {
          "id": "occupantName",
          "label": "Name of the occupant",
          "type": "text",
          "required": false
        }
      ]
    },
    {
      "id": "signoff",
      "title": "Sign-off",
      "items": [
        {
          "id": "declaration",
          "label": "Assessor declaration: I confirm this PAS 2035 condition report is descriptive and evidence-based; any actions/flags are recorded for further review.",
          "type": "checkbox",
          "required": true
        },
        {
          "id": "occupantSignature",
          "label": "Occupant signature (type name)",
          "type": "text",
          "required": false
        },
        {
          "id": "assessorSignature",
          "label": "Assessor signature (type name)",
          "type": "text",
          "required": true
        },
        {
          "id": "signoffPhotos",
          "label": "Additional evidence photos (optional)",
          "type": "photos",
          "required": false
        }
      ]
    }
  ]
};
