import { A } from "@solidjs/router";
import "./About.css";

const About = () => {
	return (
		<article class="about-panel">
			<p>ラブライブ！シリーズの聖地情報をまとめたマップです。</p>
			<A href="/register">
				<button type="button">聖地を登録する</button>
			</A>
		</article>
	);
};

export default About;
