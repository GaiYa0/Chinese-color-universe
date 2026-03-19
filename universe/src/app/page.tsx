import { fetchColors } from "@/services/data/data";
import HomeClient from "@/modules/universe/ui/HomeClient";

export default async function HomePage() {
  const colors = await fetchColors();

  return (
    <main className="min-h-screen" style={{ background: "#050510" }}>
      <HomeClient colors={colors} />
    </main>
  );
}
