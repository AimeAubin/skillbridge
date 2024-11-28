export interface Skill {
  id: string;
  name: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MySkill {
  id: string;
  proficiencyLevel: string;
  skill: Skill;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  status: string;
  desiredProficiency: string;
  skill: Skill;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
