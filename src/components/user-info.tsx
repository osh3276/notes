import { auth } from "@/auth";

export default async function UserInfo() {
	const session = await auth();

	if (!session?.user) return null;

	return (
		<div>
			<p>{session.user.name}</p>
			<img src={session.user.image ?? undefined} alt="User Avatar" />
		</div>
	);
}
