export default function ChartContainer({id}: {id: number}) {
  return (
    <div className="w-full h-[400px] rounded-lg border-2 border-muted flex items-center justify-center">
      <p className="text-muted-foreground">Chart will be displayed here</p>
    </div>
  );
}