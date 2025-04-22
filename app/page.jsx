import PageLayout from "@/components/shared/layout/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ברוכים הבאים למחברת</h1>
        <p className="mb-4">המקום האישי שלך להערות ומחשבות.</p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">הפלטפורמה לתלמידים</h2>
          <p className="mb-4">
            המחברת היא כלי עוצמתי שמסייע לתלמידים לארגן את חומרי הלימוד, להפיק
            סיכומים ולשתף מידע.
          </p>
          <p>
            התחילו בלחיצה על "נושאים" בתפריט כדי לעיין בחומרי הלימוד לפי נושא.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">יתרונות המערכת</h2>
          <ul className="list-disc pr-5 space-y-2">
            <li>גישה לכל חומרי הלימוד במקום אחד</li>
            <li>סיכומים חכמים באמצעות בינה מלאכותית</li>
            <li>שיתוף וחבירה לקבוצות לימוד</li>
            <li>ממשק ידידותי ונוח לשימוש</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
