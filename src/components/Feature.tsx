import { Card } from "./ui/card";

interface FeatureProps {
  title: string;
  description: string[];
  url: string;
}

export default function Feature({ title, description, url }: FeatureProps) {
  return (
    <Card className="relative justify-between p-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105"
        style={{ backgroundImage: `url('${url}')`, opacity: 0.7 }}
      ></div>
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-linear-to-b from-black/70 to-transparent"></div>
      <h3 className="text-white text-2xl font-semibold self-center text-center z-10 p-6">
        {title}
      </h3>
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
