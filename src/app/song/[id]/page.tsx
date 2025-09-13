import { Metadata } from "next";
import SongDetailsPage from "./song-details-page";

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	try {
		const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
		const response = await fetch(
			`${baseUrl}/api/track/${(await params).id}`,
			{
				cache: "no-store",
			},
		);

		if (!response.ok) {
			return {
				title: "Song Details",
				description: "View detailed information about this track",
			};
		}

		const track = await response.json();

		return {
			title: `${track.name} by ${track.artists.map((a: any) => a.name).join(", ")} - Song Details`,
			description: `Listen to ${track.name} by ${track.artists.map((a: any) => a.name).join(", ")} from the album ${track.album.name}. View audio features, track details, and more.`,
			openGraph: {
				title: `${track.name} by ${track.artists.map((a: any) => a.name).join(", ")}`,
				description: `From the album ${track.album.name}`,
				images: track.album.images[0]
					? [track.album.images[0].url]
					: [],
				type: "music.song",
			},
			twitter: {
				card: "summary_large_image",
				title: `${track.name} by ${track.artists.map((a: any) => a.name).join(", ")}`,
				description: `From the album ${track.album.name}`,
				images: track.album.images[0]
					? [track.album.images[0].url]
					: [],
			},
		};
	} catch (error) {
		return {
			title: "Song Details",
			description: "View detailed information about this track",
		};
	}
}

export default function Page() {
	return <SongDetailsPage />;
}
