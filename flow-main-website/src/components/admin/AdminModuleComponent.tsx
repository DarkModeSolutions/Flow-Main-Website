import { useRouter } from "next/navigation";

const AdminModuleComponent = ({
  title,
  url,
  isDisabled,
}: {
  title: string;
  url: string;
  isDisabled?: boolean;
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(url)}
      className={`flow-border-color border-2 p-4 rounded-lg ${
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-lg transition-shadow"
      }`}
    >
      <h2>
        {title} {isDisabled && "(Coming Soon)"}
      </h2>
    </div>
  );
};

export default AdminModuleComponent;
