import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const LoadingComponent = ({ className }: { className?: string }) => {
  return <Spinner className={cn("mx-auto my-20 size-10", className)} />;
};

export default LoadingComponent;
