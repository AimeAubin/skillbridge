export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface MySkill {
  id: string;
  proficiencyLevel: string;
  skill: Skill;
  createdAt: string;
  updatedAt: string;
}
