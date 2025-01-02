const initialData = [
  {
    id: 1,
    name: "Asuransi 1",
    branch: [
      {
        id: 1,
        name: "A1",
      },
      {
        id: 2,
        name: "A2",
      },
    ],
  },
  {
    id: 2,
    name: "Asuransi 2",
    branch: [
      {
        id: 1,
        name: "A1",
      },
      {
        id: 2,
        name: "A2",
      },
    ],
  },
];

interface IBranchGuarantor {
  id?: number;
  name?: string;
}

export interface IPairingGuarantor {
  id?: number | null;
  name?: string | null;
  branches?: IBranchGuarantor[];
}
