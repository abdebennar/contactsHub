



export async function register() {
	console.log('🚀 INSTRUMENTATION STARTED');
	console.log('Runtime:', process.env.NEXT_RUNTIME);
	console.log('Environment:', process.env.NODE_ENV);

	if (process.env.NEXT_RUNTIME === 'nodejs') {
		console.log('📦 Loading bootstrap...');
		const { bootstrap } = await import('./lib/bootstrap');
		await bootstrap();
		console.log('✅ Bootstrap complete');
	}
}