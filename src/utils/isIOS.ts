// utils/isIOS.ts

interface Window {
	MSStream?: any;
}

export const isIOS = (): boolean => {
	if (typeof window !== 'undefined') {
		const userAgent = window.navigator.userAgent;
		return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
	}
	return false;
};
