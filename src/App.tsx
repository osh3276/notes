import { Header } from "./components/Header";
import { PopularSongs } from "./components/PopularSongs";
import { PopularReviews } from "./components/PopularReviews";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 dark">
      <Header />
      <main>
        <PopularSongs />
        <PopularReviews />
      </main>
    </div>
  );
}