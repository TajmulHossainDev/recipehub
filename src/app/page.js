import Banner from "@/components/home/Banner";
import BrowseByCategory from "@/components/home/BrowseByCategory";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import HowItWorks from "@/components/home/HowItWorks";
import PopularRecipes from "@/components/home/PopularRecipes";
import Footer from "@/components/shared/Footer";
import AppNavbar from "@/components/shared/Navbar";
import { GiKnifeFork } from "react-icons/gi";

export default function Home() {
  return (
    <main>
      <AppNavbar></AppNavbar>
      <div className="p-8 text-center text-[#111827]">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
          RecipeHub
          <GiKnifeFork className="text-4xl" />
        </h1>
      </div>
      <Banner></Banner>
      <FeaturedRecipes></FeaturedRecipes>
      <PopularRecipes></PopularRecipes>
      <HowItWorks></HowItWorks>
      <BrowseByCategory></BrowseByCategory>
      <Footer></Footer>
    </main>
  );
}
