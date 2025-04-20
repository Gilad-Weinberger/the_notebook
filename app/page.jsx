import PageLayout from "@/components/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to The Notebook</h1>
        <p className="mb-4">Your personal space for notes and thoughts.</p>
      </div>
    </PageLayout>
  );
}
