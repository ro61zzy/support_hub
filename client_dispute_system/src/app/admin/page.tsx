"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import CustomIcon from "@/components/CustomIcon";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "pending" | "resolved";
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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
    const fetchIssues = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("disputes").select("*");

      if (error) {
        console.error("Error fetching issues:", error.message);
      } else {
        setIssues(data || []);
      }
      setLoading(false);
    };

    fetchIssues();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-buttons">
            Submitted Issues
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {issues.map((issue) => (
              <Link href={`/admin/issue_details/${issue.id}`} key={issue.id}>
                <div className="bg-white p-4 border rounded-lg shadow-lg w-full md:w-[100%] h-44 mx-auto flex flex-col relative">
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold line-clamp-2">
                      {issue.title.split(" ").slice(0, 4).join(" ")}...
                    </h2>
                    <p className="text-gray-700 text-sm">
                      {issue.description.split(" ").slice(0, 7).join(" ")}...
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`flex gap-1 items-center text-black text-[10px] sm:text-xs  font-semibold uppercase ${
                        issue.status === "pending"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      <CustomIcon
                        color={
                          issue.status === "pending"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }
                      />
                      {issue.status}
                    </span>

                    {issue.status !== "resolved" && (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded text-[12px] sm:text-sm"
                        onClick={async (e) => {
                          e.preventDefault();
                          const { error } = await supabase
                            .from("disputes")
                            .update({ status: "resolved" })
                            .eq("id", issue.id);

                          if (!error) {
                            setIssues((prev) =>
                              prev.map((i) =>
                                i.id === issue.id
                                  ? { ...i, status: "resolved" }
                                  : i
                              )
                            );
                          }
                        }}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
