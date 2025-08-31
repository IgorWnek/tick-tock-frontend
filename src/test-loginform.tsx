// Test file to verify LoginForm can be imported and used
import { LoginForm } from '@/design-system/organisms/LoginForm';

// Simple test component
export const TestLoginForm = () => {
  const handleSuccess = () => {
    // Login successful action would go here
  };

  return (
    <div>
      <h1>Test LoginForm</h1>
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
};
