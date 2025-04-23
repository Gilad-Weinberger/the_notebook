"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const UserManagement = () => {
  // Define available roles
  const roles = ["admin", "student"];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user.");
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role.");
    }
  };

  return (
    <div className="w-full" dir="rtl">
      <h2 className="text-xl font-semibold mb-4">ניהול משתמשים</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p>טוען משתמשים...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right border-b">שם</th>
                <th className="py-3 px-4 text-right border-b">אימייל</th>
                <th className="py-3 px-4 text-right border-b">תפקיד</th>
                <th className="py-3 px-4 text-right border-b">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {user.name || "ללא שם"}
                  </td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.role || "student"}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="py-1 px-2 border rounded"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role === "admin" ? "מנהל" : "סטודנט"}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center">
                    לא נמצאו משתמשים
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
