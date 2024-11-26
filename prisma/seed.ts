import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  type Category = "TECHNICAL" | "SOFTSKILLS";

  const predefinedSkills: { name: string; category: Category }[] = [
    { name: "JavaScript", category: "TECHNICAL" },
    { name: "TypeScript", category: "TECHNICAL" },
    { name: "React", category: "TECHNICAL" },
    { name: "Angular", category: "TECHNICAL" },
    { name: "Python", category: "TECHNICAL" },
    { name: "Teamwork", category: "SOFTSKILLS" },
    { name: "Leadership", category: "SOFTSKILLS" },
  ];

  try {
    await prisma.skill.deleteMany();
    await prisma.skill.createMany({
      data: predefinedSkills,
      skipDuplicates: true,
    });
    console.log("Predefined skills seeded!");
  } catch (e) {
    console.error(e);
    throw e;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
