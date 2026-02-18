import { ReactNode } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
type DataProps = {
  name: string;
};

const data = [
  { name: "Java" },
  { name: "Docker" },
  { name: "Django" },
  { name: "Mongo DB" },
  { name: "Kubernetes" },
  { name: "Amazon Web Services" },
  { name: "React" },
  { name: "Next" },
  { name: "Next" },
];

const moreSkills = data.length > 8 ? "" : "hidden";

function Skills() {
  const visibleSkills = data.slice(0, 8);
  const showMore = data.length > 8;
  const Colors = useColors();
  return (
    <div
      className={`${Colors.text.primary} font-mono flex flex-col justify-between h-full gap-2`}
    >
      <div>
        <h1 className="text-2xl">Skills and Technologies</h1>
        <div className={`${Colors.border.defaultThinBottom} mb-3`} />
      </div>

      <div className="grid grid-rows-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 h-full">
        {visibleSkills.map((item, index) => (
          <GridItem key={index} name={item.name} />
        ))}
      </div>

      {showMore && <p className="text-center text-sm cursor-pointer hover:underline mx-auto">See More {">>"}</p>}
    </div>
  );
}

function GridItem({ name }: DataProps) {
  const Colors = useColors();
  return (
    <div
      className={`${Colors.background.secondary} flex items-center justify-center w-full min-h-20 rounded-xl`}
    >
      <h1 className="text-sm text-center">{name}</h1>
    </div>
  );
}

export default Skills;
