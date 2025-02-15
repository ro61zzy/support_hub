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
    return <p>Getting your data...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Disputes</h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <p>Loading disputes...</p>
      ) : disputes.length === 0 ? (
        <p>No disputes found.</p>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="p-4 bg-white shadow-md rounded-lg">
              <h3 className="text-lg font-bold">{dispute.title}</h3>
              <p className="text-gray-600">{dispute.description}</p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-semibold">{dispute.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition"
        onClick={() => router.push("/dashboard/create-dispute")}
      >
        Create New Dispute
      </button>
    </div>
  );
}
