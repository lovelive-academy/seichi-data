export async function fetchImage(url: string): Promise<Uint8Array> {
	const res = await fetch(url);
	const bytes = new Uint8Array(await res.arrayBuffer());
	return bytes;
}
