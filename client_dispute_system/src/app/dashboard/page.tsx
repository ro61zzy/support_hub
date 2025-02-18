"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
<div className="  p-6 bg-gray-100 min-h-screen">


      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-3xl font-semibold text-buttons">My Issues </h2>
        <button
          className="bg-orange-500 text-white px-4 sm:px-5 py-1 sm:py-2 text-sm tx-lg rounded-lg font-semibold shadow-md hover:bg-orange-600 transition "
          onClick={() => router.push("/dashboard/create-dispute")}
        >
          + Create New Issue
        </button>
      </div>


      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-400">
          {errorMessage}
        </div>
      )}


      {loading ? (
        <p className="text-center text-gray-600">Loading issues...</p>
      ) : disputes.length === 0 ? (
        <p className="text-center text-gray-500">You have no current issues, create a new issue to get started.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {disputes.map((dispute) => (
            <Link key={dispute.id} href={`/dashboard/issue_details/${dispute.id}`}>
              <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 w-[100%] h-40 cursor-pointer hover:shadow-xl transition">
              <div className="flex-grow">

                <h3 className="text-lg font-bold text-gray-900">{dispute.title.split(" ").slice(0, 4).join(" ")}...</h3>
                <p className="text-gray-600 text-sm mt-2">{dispute.description.split(" ").slice(0, 6).join(" ")}...</p>
              </div>
                <p className="mt-3 text-[12px] text-gray-500">
                  Status: <span className={`font-semibold ${dispute.status === "pending" ? "text-red-500" : "text-green-500"}`}>{dispute.status}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
