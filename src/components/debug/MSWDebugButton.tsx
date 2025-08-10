import React from 'react';

import { Button } from '@/components/ui/button';

/**
 * Debug component to test MSW parseMessage functionality directly
 * Use this to verify MSW handlers are working correctly
 */
export const MSWDebugButton: React.FC = () => {
  const testParseMessage = async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('🧪 Testing direct fetch to MSW handler...');

      const response = await fetch('/api/time-logs/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Worked on XYZ-1111 for 3 hours implementing authentication',
          date: new Date().toISOString().split('T')[0],
        }),
      });

      // eslint-disable-next-line no-console
      console.log('🧪 Response status:', response.status);

      const data = await response.json();
      // eslint-disable-next-line no-console
      console.log('🧪 Response data:', data);

      if (data.entries && data.entries.length > 0) {
        alert(`✅ MSW is working! Parsed ${data.entries.length} entries with ${data.confidence}% confidence`);
      } else {
        alert('⚠️ MSW responded but no entries parsed. Check console for details.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('🧪 Direct fetch error:', error);
      alert('❌ MSW test failed. Check console for error details.');
    }
  };

  return (
    <Button onClick={testParseMessage} variant="outline" className="mb-4">
      🧪 Test MSW Direct
    </Button>
  );
};
