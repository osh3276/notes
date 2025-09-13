import SignIn from "@/components/sign-in";
import UserInfo from "@/components/user-info";
import SpotifySearch from "@/components/SpotifySearch";

export default function Home() {
	return (
		<div className="font-sans min-h-screen bg-gray-50">
			<div className="container mx-auto py-8">
				<div className="mb-8 text-center">
					<UserInfo />
					<SignIn />
				</div>
				<SpotifySearch />
			</div>
		</div>
	);
}
