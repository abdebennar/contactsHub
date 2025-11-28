// components/ViewsProvider.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ViewsContextType {
	viewsToday: number;
	incrementViews: () => void;
}

const ViewsContext = createContext<ViewsContextType | undefined>(undefined);

export function ViewsProvider({ children, initialViews }: { children: ReactNode; initialViews: number }) {
	const [viewsToday, setViewsToday] = useState(initialViews);

	const incrementViews = () => {
		setViewsToday(prev => prev + 1);
	};

	return (
		<ViewsContext.Provider value={{ viewsToday, incrementViews }}>
			{children}
		</ViewsContext.Provider>
	);
}

export function useViews() {
	const context = useContext(ViewsContext);
	if (!context) {
		throw new Error('useViews must be used within ViewsProvider');
	}
	return context;
}