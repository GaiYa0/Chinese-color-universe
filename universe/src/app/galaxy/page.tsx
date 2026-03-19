import { fetchColors } from "@/services/data/data";
import ColorGalaxy from "@/modules/explore/ui/ColorGalaxy";

export default async function GalaxyPage() {
  const colors = await fetchColors();

  return (
    <main className="cosmic-bg flex h-screen flex-col overflow-hidden pt-20">
      <ColorGalaxy colors={colors} />
    </main>
  );
}
