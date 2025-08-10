export async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  try {
    // static import will cause msw to be bundled into production code and significantly increase bundle size
    const { worker } = await import('api/mocks/mock-worker');

    await worker.start({
      onUnhandledRequest: 'warn', // Changed from 'bypass' to 'warn' for debugging
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });

    // eslint-disable-next-line no-console
    console.log('🔧 MSW: Mock Service Worker started successfully');
    // eslint-disable-next-line no-console
    console.log('🔧 MSW: Available handlers count:', worker.listHandlers().length);

    return worker;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('🚨 MSW: Failed to start Mock Service Worker:', error);
    throw error;
  }
}
