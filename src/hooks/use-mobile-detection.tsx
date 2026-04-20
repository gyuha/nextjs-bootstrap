"use client";

import { useEffect, useState } from "react";

const useMobileDetection = (maxWidth = 768) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobileSize = () => {
			setIsMobile(window.innerWidth <= maxWidth);
		};

		checkMobileSize();

		window.addEventListener("resize", checkMobileSize);

		return () => {
			window.removeEventListener("resize", checkMobileSize);
		};
	}, [maxWidth]);

	return isMobile;
};

export default useMobileDetection;
