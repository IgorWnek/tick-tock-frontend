import { useMutation } from 'hooks/useMutation/useMutation';

export const useParseMessage = () => {
  return useMutation('parseMessage', {
    meta: {
      successMessage: 'Message parsed successfully!',
      errorMessage: 'Failed to parse message. Please try again.',
    },
  });
};
