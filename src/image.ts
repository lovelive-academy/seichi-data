import { PhotonImage, resize, SamplingFilter } from "@cf-wasm/photon/node";

export async function processImage(url: string): Promise<Uint8Array> {
	const res = await fetch(url);
	const bytes = new Uint8Array(await res.arrayBuffer());
	const image = PhotonImage.new_from_byteslice(bytes);

	if (image.get_height() > 720) {
		const scale = 720 / image.get_height();
		const newWidth = Math.round(image.get_width() * scale);
		const resized = resize(image, newWidth, 720, SamplingFilter.Lanczos3);
		const result = resized.get_bytes_jpeg(80);
		resized.free();
		image.free();
		return result;
	}

	const result = image.get_bytes_jpeg(80);
	image.free();
	return result;
}
