import React from "react";
import PageLayout from "@/components/shared/layout/PageLayout";

const AdminLayout = ({ user, isAdmin, loading, children }) => {
  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center">טוען...</p>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">אנא התחבר כדי לגשת לעמוד זה.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border-r-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">אין לך הרשאות לצפות בעמוד זה.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">ניהול מערכת</h1>
        {children}
      </div>
    </PageLayout>
  );
};

export default AdminLayout;
