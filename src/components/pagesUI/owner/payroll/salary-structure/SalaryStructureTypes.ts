// SalaryStructureTypes.ts
export interface ISalaryComponent {
  id: string;
  name: string;
  amount: number;
}

export interface ISalaryStructure {
  id: number;
  structureName: string;
  structureCode: string;
  components: ISalaryComponent[];
  created_at: string;
  status: "Active" | "Inactive";
}
