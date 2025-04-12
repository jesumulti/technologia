import { useRouter } from 'next/router';

export default function OrgWidgetPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      Org Widget Page - Org ID: {id}
    </div>
  );
}