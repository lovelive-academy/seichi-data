import type { Env } from "../main.ts";

export function getEnv(env: Env, name: keyof Env): string {
	const value = env[name];
	if (!value) throw new Error(`${name} is not set`);
	return value;
}
