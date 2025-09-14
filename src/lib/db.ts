import { neon, neonConfig } from "@neondatabase/serverless";
import { Pool } from "@neondatabase/serverless";
import { GoogleGenerativeAI } from "@google/generative-ai";

neonConfig.fetchConnectionCache = true;

let pool: Pool | null = null;

export function getPool() {
	if (!pool) {
		const connectionString = process.env.DATABASE_URL;
		if (!connectionString) {
			throw new Error("DATABASE_URL is not defined");
		}
		pool = new Pool({ connectionString });
	}
	return pool;
}

// For one-off queries
export async function sql(strings: TemplateStringsArray, ...values: any[]) {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) throw new Error("DATABASE_URL is not defined");
	return neon(connectionString)(strings, ...values);
}

// For transactions or when you need a client
export async function withClient<T>(
	callback: (client: any) => Promise<T>,
): Promise<T> {
	const pool = getPool();
	const client = await pool.connect();
	try {
		return await callback(client);
	} finally {
		client.release();
	}
}

export async function testConnections(): Promise<{
	dbStatus: string;
	geminiStatus: string;
}> {
	try {
		// Test database connection
		const dbResult = await sql`SELECT 1 as test`;
		const dbStatus = dbResult
			? "Database connection successful"
			: "Database connection failed";

		// Test Gemini API
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
		const prompt = "Say 'API connection successful' if you can read this.";
		const response = await model.generateContent(prompt);
		const geminiStatus = response.response.text();

		return { dbStatus, geminiStatus };
	} catch (error: any) {
		console.error("Test connection error:", error);
		return {
			dbStatus: `Database error: ${error.message}`,
			geminiStatus: `Gemini error: ${error.message}`,
		};
	}
}

export async function getSongReviewsSummary(songId: string): Promise<string> {
	// Initialize Gemini API
	const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
	const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

	try {
		// Get reviews from database
		const result = await sql`
      SELECT review, rating
      FROM song_feedback
      WHERE song_id = ${songId}
    `;

		// If there are less than 10 reviews, return empty string
		if (result.length < 1) {
			// set to 1 for testing
			return "";
		}

		// Combine all reviews into one text, including ratings
		const allReviews = result
			.map((row) => `Rating: ${row.rating}/5\nReview: ${row.review}`)
			.join("\n\n");

		// Generate summary with Gemini
		const prompt = `Please provide a concise summary of these song reviews and their ratings. Focus on:
    1. The average sentiment (positive/negative)
    2. Common themes or patterns in the reviews
    3. Notable opinions that stand out
    4. The range of ratings and what they mean

    <output instructions>
    Only output the summary text. Do not include any other commentary or information.
    Only output the text in plaintext. Do not include Markdown or any other formatting languages.
    </output instructions>

    Here are the reviews:
    ${allReviews}`;

		const response = await model.generateContent(prompt);
		const summary = response.response.text();

		return summary;
	} catch (error) {
		console.error("Error getting song reviews summary:", error);
		return "";
	}
}
