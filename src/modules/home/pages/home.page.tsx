import { CategoriesSection } from '../components/categories.section';
import FeaturedOrganizers from '../components/featured-ogranizers.section';
import { HeroSection } from '../components/hero.section';
import UpcomingEventsSection from '../components/upcoming-events.section';

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center dark:bg-gray-900">
      <HeroSection />
      <div className="grid items-center justify-center gap-6 px-6">
        <CategoriesSection />
        <UpcomingEventsSection />
        <FeaturedOrganizers />
      </div>
    </div>
  );
};
