import { useParams } from '@tanstack/react-router';

import { CodeBlock } from '@/components/ui/code-block';

export const User = () => {
  const params = useParams({ from: '/users/$id/' });

  return (
    <>
      <h2>User</h2>
      <CodeBlock>Params extracted from url: {JSON.stringify(params, null, 4)}</CodeBlock>
    </>
  );
};
