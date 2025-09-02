/// <reference types="vite/client" />

interface UserConfig {
	language: string;
	darkMode: boolean | 'system';
}

interface ElectronAPI {
	getUserConfig: () => Promise<UserConfig>;
	setLanguage: (lang: string) => Promise<void>;
	setDarkMode: (mode: boolean | 'system') => Promise<void>;
	onThemeChanged: (callback: (isDark: boolean) => void) => void;
	sendGame: (game: string, status: string, customGame: string) => void;
	sendIdle: (clicks: number) => void;
}

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}
}
