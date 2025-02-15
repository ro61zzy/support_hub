"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getUserData() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/auth");
          return;
        }

        const { data, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (userError || !data) {
          console.error("Error fetching user data:", userError);
          router.push("/auth");
          return;
        }

        setUserId(data.id);
      } catch (err) {
        console.error("Unexpected error fetching user data:", err);
      }
    }

    getUserData();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const fetchDisputes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("disputes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage("Failed to fetch disputes");
      } else {
        setDisputes(data);
      }

      setLoading(false);
    };

    fetchDisputes();
  }, [userId]);

  if (!userId) {
    return <p className="text-center mt-10 text-gray-600">Loading user data...</p>;
  }

  return (
<div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Issues Dashboard</h2>
        <button
          className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition"
          onClick={() => router.push("/dashboard/create-dispute")}
        >
          + Create New Issue
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-400">
          {errorMessage}
        </div>
      )}

      {/* Disputes Grid */}
      {loading ? (
        <p className="text-center text-gray-600">Loading issues...</p>
      ) : disputes.length === 0 ? (
        <p className="text-center text-gray-500">No Issues found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="p-5 bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900">{dispute.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{dispute.description}</p>
              <p className="mt-3 text-sm text-gray-500">
                Status: <span className="font-semibold text-blue-600">{dispute.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
