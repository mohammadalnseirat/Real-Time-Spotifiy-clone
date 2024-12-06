import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  icon: React.ElementType;
  value: string;
  bgColor: string;
  iconColor: string;
};

const StatsCard = ({
  label,
  icon: Icon,
  value,
  bgColor,
  iconColor,
}: StatsCardProps) => {
  return (
    <Card
      className={`${bgColor} border border-gray-600 cursor-pointer transition-colors`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg ${bgColor} p-3`}>
            <Icon className={`w-6 h-6  ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">{label}</p>
            <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
