export interface Plan {
  id: number;
  name: string;
  price: string;
  features: string[];
}

export interface PlanEmit {
  (event: "select", planId: number): void;
}