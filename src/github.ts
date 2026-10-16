import { Buffer } from "node:buffer";
import { createPrivateKey } from "node:crypto";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "octokit";
import type { Bindings } from "./env.ts";
import type { Feature, SpotData } from "./schema.ts";

// GitHub Appの秘密鍵はPKCS1形式で発行されるが、
// JWT署名に使うWebCryptoのSubtleCryptoはPKCS1形式の鍵を扱えないため、
// createAppAuthに渡す前にPKCS8形式へ変換しておく必要がある
function toP8Pem(pem: string): string {
	if (!pem.includes("BEGIN RSA PRIVATE KEY")) return pem;
	return createPrivateKey(pem).export({
		type: "pkcs8",
		format: "pem",
	}) as string;
}

function createOctokit(env: Bindings): Octokit {
	return new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: env.GITHUB_APP_ID,
			privateKey: toP8Pem(atob(env.GITHUB_APP_PRIVATE_KEY)),
			installationId: env.GITHUB_INSTALLATION_ID,
		},
	});
}

export async function createSpotPR(
	spot: SpotData,
	env: Bindings,
): Promise<string> {
	const octokit = createOctokit(env);
	const owner = env.GITHUB_REPO_OWNER;
	const repo = env.GITHUB_REPO_NAME;
	const uuid = crypto.randomUUID();
	const branchName = `add-spot/${uuid}`;

	const { data: ref } = await octokit.rest.git.getRef({
		owner,
		repo,
		ref: "heads/main",
	});

	await octokit.rest.git.createRef({
		owner,
		repo,
		ref: `refs/heads/${branchName}`,
		sha: ref.object.sha,
	});

	const newFeature: Feature = {
		type: "Feature",
		id: uuid,
		geometry: {
			type: "Point",
			coordinates: [spot.lng, spot.lat],
		},
		properties: {
			title: spot.title,
			author: spot.discordUsername,
		},
	};

	if (spot.description) {
		newFeature.properties.description = spot.description;
	}
	if (spot.imageBytes) {
		newFeature.properties.image = ["image.jpg"];
	}
	if (spot.tags.length > 0) {
		newFeature.properties.tags = spot.tags;
	}

	await octokit.rest.repos.createOrUpdateFileContents({
		owner,
		repo,
		path: `public/spots/${spot.series.id}/${uuid}/spot.json`,
		message: `Add spot: ${spot.title}`,
		content: Buffer.from(JSON.stringify(newFeature, null, 2)).toString(
			"base64",
		),
		branch: branchName,
	});

	if (spot.imageBytes) {
		await octokit.rest.repos.createOrUpdateFileContents({
			owner,
			repo,
			path: `public/spots/${spot.series.id}/${uuid}/image.jpg`,
			message: `Add image for spot: ${spot.title}`,
			content: Buffer.from(spot.imageBytes).toString("base64"),
			branch: branchName,
		});
	}

	const prBody = `## 投稿情報

- シリーズ: ${spot.series.name}
- 施設名: ${spot.title}
- 座標: ${spot.lat}, ${spot.lng}
- タグ: ${spot.tags.length > 0 ? spot.tags.join(", ") : "(なし)"}
- 投稿者: ${spot.discordUsername} (${spot.discordUserId})
- 投稿日時: ${new Date().toISOString()}

## 説明

${spot.description ?? "(説明なし)"}`;

	const { data: pr } = await octokit.rest.pulls.create({
		owner,
		repo,
		title: `[${spot.series.name}] ${spot.title}`,
		body: prBody,
		head: branchName,
		base: "main",
	});

	return pr.html_url;
}
