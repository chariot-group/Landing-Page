import { Card } from "./ui/card";

interface FeatureProps {
  title: string;
  description: string[];
  url: string;
}

export default function Feature({ title, description, url }: FeatureProps) {
  return (
    <Card
      className={`relative justify-between bg-cover bg-center bg-no-repeat p-0`}
      style={{ backgroundImage: `url('${url}')` }}
    >
      <h2 className="text-white text-2xl font-semibold self-center text-center z-10 p-6">
        {title}
      </h2>
      <div className="flex flex-col gap-2 z-10 bg-linear-to-t from-black rounded-b-[24px] to-transparent p-6">
        {description.map((desc, index) => (
          <p key={index} className="text-white md:text-sm text-xs ">
            {desc}
          </p>
        ))}
      </div>
    </Card>
  );
}
