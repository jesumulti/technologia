import { useRouter } from 'next/router';

export default function OrgSettingsPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      Org Settings Page - ID: {id}
    </div>
  );
}