export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Campaign {id}</h1>
      <p>Campaign detail with audience, design proof, tracking analytics.</p>
    </div>
  );
}
