import { createFileRoute } from '@tanstack/react-router';

import { ProfileForm } from '@/design-system/organisms/ProfileForm';

/**
 * Demo page for ProfileForm organism
 *
 * This is a temporary demo route to showcase the ProfileForm component
 * for visual verification and testing purposes.
 */
function ProfileDemo() {
  const handleProfileUpdate = () => {
    // Profile update callback for demo
  };

  const handlePasswordUpdate = () => {
    // Password update callback for demo
  };

  const handleCancel = () => {
    // Cancel callback for demo
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">ProfileForm Demo</h1>
        <p className="text-muted-foreground">This is a demo page to showcase the ProfileForm organism component.</p>
      </div>

      <ProfileForm
        onProfileUpdate={handleProfileUpdate}
        onPasswordUpdate={handlePasswordUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
}

export const Route = createFileRoute('/profile-demo')({
  component: ProfileDemo,
});
