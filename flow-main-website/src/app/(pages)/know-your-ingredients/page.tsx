import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ingredients {
  listHeading: string;
  lists: { subListHeading: string; subListContent: string }[];
}

interface Advantages {
  listHeading: string;
  lists: { subListHeading: string; subListContent: string }[];
}

interface Isotonicity {
  type: "list" | "table";
  tableContent?: {
    tableHeader: string;
    tableSubHeader: string;
    tableContent: {
      tableHeaderRow: string[];
      tableRows: {
        compound: string;
        amount: number | string;
        molarMass: number | string;
        moles: number | string;
        osmoticParticles: number | string;
        contribution: string;
      }[];
    };
  };
  listContent?: {
    listHeading: string;
    lists: { subListHeading: string; subListContent: string }[];
  };
}

const KnowYourIngredients = () => {
  const ingredients: Ingredients[] = [
    {
      listHeading: "Electrolyte Balance & Osmoregulation",
      lists: [
        {
          subListHeading: "Sodium chloride (1320 mg)",
          subListContent:
            "Sodium chloride (1320 mg): Primary extracellular ion; regulates fluid balance, nerve transmission, and muscle function.",
        },
        {
          subListHeading: "Potassium chloride (408.02 mg)",
          subListContent:
            "Intracellular ion; critical for cardiac rhythm, neuromuscular activity, and acid-base balance.",
        },
        {
          subListHeading: "Magnesium lactate (119.78 mg)",
          subListContent:
            "Cofactor in >300 enzymatic reactions; supports muscle relaxation, ATP synthesis, and electrolyte transport.",
        },
        {
          subListHeading: "Calcium carbonate (20.19 mg)",
          subListContent:
            "Stabilizes membrane potential, aids in muscle contraction, and supports bone health.",
        },
        {
          subListHeading: "Trisodium citrate dihydrate (980.03 mg)",
          subListContent:
            "Alkalinizing agent; buffers lactic acid, improves endurance, and enhances sodium absorption via SGLT1.",
        },
      ],
    },
    {
      listHeading: "Energy & Glycogen Replenishment",
      lists: [
        {
          subListHeading: "D-Glucose (18000 mg)",
          subListContent:
            "Rapid energy source; facilitates sodium and water absorption via sodium-glucose co-transporters.",
        },
        {
          subListHeading: "Dextrin (2000 mg)",
          subListContent:
            "Slower-digesting carb; sustains energy release and supports glycogen restoration.",
        },
      ],
    },
    {
      listHeading: "Flavour, Palatability & Acid-Base Modulation",
      lists: [
        {
          subListHeading: "Citric acid (1000 mg) + Malic acid (1500 mg)",
          subListContent:
            "Enhance taste, stimulate salivation, and act as intermediates in the Krebs cycle.",
        },
        {
          subListHeading: "Grapefruit powder (1000 mg)",
          subListContent:
            "Natural flavouring; may offer antioxidant polyphenols.",
        },
        {
          subListHeading: "Sucralose (1000 mg)",
          subListContent:
            "Non-caloric sweetener; improves compliance without glycemic impact.",
        },
      ],
    },
    {
      listHeading: "Antioxidant & Cellular Protection",
      lists: [
        {
          subListHeading: "Vitamin C (500 mg)",
          subListContent:
            "Scavenges free radicals, supports immune function, and enhances iron absorption.",
        },
        {
          subListHeading: "Tocopherol (8 mg)",
          subListContent:
            "Lipid-phase antioxidant; protects cell membranes from oxidative damage.",
        },
      ],
    },
    {
      listHeading: "B-Vitamin Complex for Metabolic Support",
      lists: [
        {
          subListHeading:
            "Niacin (7 mg), B5 (5 mg), B6 (2 mg), B1 (2 mg), B2 (1 mg)",
          subListContent:
            "Coenzymes in energy metabolism, neurotransmitter synthesis, and redox reactions.",
        },
        {
          subListHeading: "Folic acid (200 mcg)",
          subListContent:
            "DNA synthesis, methylation, and red blood cell formation.",
        },
        {
          subListHeading: "Retinyl acetate (500 mcg)",
          subListContent:
            "Vision, epithelial integrity, and immune modulation.",
        },
      ],
    },
  ];

  const advantages: Advantages[] = [
    {
      listHeading: "Formulation Strengths",
      lists: [
        {
          subListHeading: "Balanced osmolyte profile",
          subListContent:
            "Covers sodium, potassium, magnesium, and calcium in physiologically relevant ratios.",
        },
        {
          subListHeading: "Dual carbohydrate system",
          subListContent:
            "Combines fast and slow-release carbs for immediate and sustained energy.",
        },
        {
          subListHeading: "Buffered system",
          subListContent:
            "Citrate and malate reduce exercise-induced acidosis and improve endurance.",
        },
        {
          subListHeading: "Comprehensive micronutrient support",
          subListContent: "Addresses oxidative stress and metabolic fatigue.",
        },
      ],
    },
    {
      listHeading: "Physiological Benefits",
      lists: [
        {
          subListHeading: "Rapid rehydration",
          subListContent:
            "Glucose-enhanced sodium absorption via SGLTI improves water uptake.",
        },
        {
          subListHeading: "Muscle recovery",
          subListContent:
            "Magnesium and potassium reduce cramps and support neuromuscular function.",
        },
        {
          subListHeading: "Immune resilience",
          subListContent:
            "Vitamin C, A, and E fortify antioxidant defences post-exertion.",
        },
        {
          subListHeading: "Cognitive and metabolic clarity",
          subListContent:
            "B-complex vitamins support neurotransmission and energy metabolism.",
        },
      ],
    },
  ];

  const isotonicity: Isotonicity[] = [
    {
      type: "list",
      listContent: {
        listHeading: "Target Osmolarity",
        lists: [
          {
            subListHeading: "Human plasma osmolarity",
            subListContent: "~280-300 mosm/L",
          },
          {
            subListHeading: "Isotonic range for oral solutions",
            subListContent:
              "250–300 mOsm/L is ideal for rapid absorption without gastric delay.",
          },
        ],
      },
    },
    {
      type: "table",
      tableContent: {
        tableHeader: "Key Contributors to Osmolarity",
        tableSubHeader:
          "We'll focus on solutes that dissociate or contribute significantly to osmotic pressure:",
        tableContent: {
          tableHeaderRow: [
            "Compond",
            "Amount (mg)",
            "Molar Mass (g/mol)",
            "Moles",
            "Osmotic Particles",
            "Contribution (mOsm)",
          ],
          tableRows: [
            {
              compound: "Sodium chloride",
              amount: 1320,
              molarMass: 58.44,
              moles: 0.0226,
              osmoticParticles: 2,
              contribution: "~45",
            },
            {
              compound: "Potassium chloride",
              amount: 408.02,
              molarMass: 74.55,
              moles: 0.0055,
              osmoticParticles: 2,
              contribution: "~11",
            },
            {
              compound: "Trisodium citrate dihydrate",
              amount: 980.03,
              molarMass: "~294.1",
              moles: 0.0033,
              osmoticParticles: 4,
              contribution: "~13",
            },
            {
              compound: "Magnesium lactate",
              amount: 119.78,
              molarMass: "~238.4",
              moles: 0.0005,
              osmoticParticles: 2,
              contribution: "~1",
            },
            {
              compound: "Calcium carbonate",
              amount: 20.19,
              molarMass: 100.1,
              moles: 0.0002,
              osmoticParticles: 2,
              contribution: "~0.4",
            },
            {
              compound: "D-Glucose",
              amount: 18000,
              molarMass: 180.16,
              moles: 0.1,
              osmoticParticles: 1,
              contribution: "~100",
            },
            {
              compound: "Citric acid + Malic acid",
              amount: 2500,
              molarMass: "~192.1 avg",
              moles: "~0.013",
              osmoticParticles: 1,
              contribution: "~13",
            },
            {
              compound: "Sucralose, vitamins, dextrin",
              amount: "-",
              molarMass: "-",
              moles: "-",
              osmoticParticles: "negligible",
              contribution: "-",
            },
          ],
        },
      },
    },
    {
      type: "list",
      listContent: {
        listHeading: "Interpretation",
        lists: [
          {
            subListHeading: "Slightly hypotonic",
            subListContent:
              "This formulation is below plasma osmolarity, which is actually beneficial for rapid gastric emptying and intestinal absorption.",
          },
          {
            subListHeading: "Glucose-driven sodium uptake",
            subListContent:
              "Via SGLT1 compensates for lower osmolarity, enhancing water absorption.",
          },
          {
            subListHeading: "Citrate and malate",
            subListContent:
              "Buffer acidosis and contribute mild osmotic load without GI irritation.",
          },
        ],
      },
    },
    {
      type: "list",
      listContent: {
        listHeading: "Strategic Advantages of Slight Hypotonicity",
        lists: [
          {
            subListHeading: "Faster absorption",
            subListContent:
              "Hypotonic solutions empty from the stomach quicker than hypertonic ones.",
          },
          {
            subListHeading: "Lower GI risk",
            subListContent:
              "Reduces bloating or osmotic diarrhea common with hypertonic drinks.",
          },
          {
            subListHeading: "Regulatory alignment",
            subListContent:
              "Matches WHO ORS osmolarity (~245 mOsm/L), allowing compliant hydration claims.",
          },
        ],
      },
    },
  ];

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold">
        Flow Hydration: Know your Ingredients
      </h2>
      <div className="mt-4">
        <div>
          <ol className="list-decimal">
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <h4 className="text-lg font-semibold mt-4">{`${ingredient.listHeading}`}</h4>
                <ul className="list-disc list-inside">
                  {ingredient.lists.map((listItem, index) => (
                    <li key={index}>
                      <span className="font-semibold">
                        {listItem.subListHeading}:
                      </span>{" "}
                      <span className="font-light">
                        {listItem.subListContent}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold">
            Advantages of This Electrolyte Formula
          </h3>
          {advantages.map((item, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mt-4">{`${item.listHeading}`}</h4>
              <ul className="list-disc list-inside">
                {item.lists.map((listItem, index) => (
                  <li className="ml-2" key={index}>
                    <span className="font-semibold">
                      {listItem.subListHeading}:
                    </span>{" "}
                    <span className="font-light">
                      {listItem.subListContent}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold">Isotonicity Assessment</h3>
          <ol className="mt-6 list-decimal list-inside">
            {isotonicity.map((listItem, index) => (
              <li className="mb-3" key={index}>
                {listItem.type === "list" && listItem.listContent ? (
                  <>
                    <span className="text-lg">
                      {listItem.listContent.listHeading}
                    </span>
                    <ul className="list-disc list-inside ml-2">
                      {listItem.listContent.lists.map((item, index) => (
                        <li key={index}>
                          <span className="font-semibold">
                            {item.subListHeading}:
                          </span>{" "}
                          <span className="font-light">
                            {item.subListContent}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="inline">
                      <span className="text-lg">
                        {listItem.tableContent?.tableHeader}
                      </span>
                      <span className="block my-2">
                        {listItem.tableContent?.tableSubHeader}
                      </span>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {listItem.tableContent?.tableContent.tableHeaderRow.map(
                            (header, index) => (
                              <TableHead key={index}>{header}</TableHead>
                            )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listItem.tableContent?.tableContent.tableRows.map(
                          (row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.compound}</TableCell>
                              <TableCell>{row.amount}</TableCell>
                              <TableCell>{row.molarMass}</TableCell>
                              <TableCell>{row.moles}</TableCell>
                              <TableCell>{row.osmoticParticles}</TableCell>
                              <TableCell>{row.contribution}</TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                    <p>
                      <span className="text-lg font-semibold">
                        Estimated total osmolarity
                      </span>
                      <span className="font-light">: ~183–200 mOsm/L</span>
                    </p>
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default KnowYourIngredients;
