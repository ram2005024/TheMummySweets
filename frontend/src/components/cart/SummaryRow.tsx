interface SummaryRowProps {
  label: string;
  value: string;
}

export const SummaryRow = ({ label, value }: SummaryRowProps) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
};
