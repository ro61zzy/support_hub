"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function IssueDetailsPage() {
  const { id } = useParams();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  type Comment = {
    id: number;
    dispute_id: number;
    user_id: string;
    message: string;
    created_at: string;
    users?: { name: string } | null;
  };

  type Dispute = {
    id: number;
    title: string;
    invoice_number: string;
    description: string;
    reason: string;
    status: string;
  };

  const fetchComments = async () => {
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select(
        `
        id, 
        dispute_id, 
        user_id, 
        message, 
        created_at
      `
      )
      .eq("dispute_id", id)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return;
    }

    const commentsWithUserDetails = await Promise.all(
      commentsData?.map(async (comment) => {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("id", comment.user_id)
          .single();

        if (userError) {
          console.error("Error fetching user:", userError);
        }

        return {
          ...comment,
          users: userData ? { name: userData.name } : null,
        };
      }) ?? []
    );

    setComments(commentsWithUserDetails);
  };

  useEffect(() => {
    if (!id) return;

    const fetchDispute = async () => {
      const { data } = await supabase
        .from("disputes")
        .select("*")
        .eq("id", id)
        .single();
      setDispute(data);
    };

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data?.user?.id || null);
    };

    fetchDispute();
    fetchComments();
    fetchUser();

    const subscription = supabase
      .channel(`comments:${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);

  const sendComment = async () => {
    if (!newComment.trim() || !currentUser || !dispute) return;

    const { error } = await supabase.from("comments").insert({
      dispute_id: dispute.id,
      user_id: currentUser,
      message: newComment,
    });

    if (!error) {
      setNewComment("");
      fetchComments();
    }
  };

  if (!dispute)
    return (
      <div className="text-center text-gray-600">Loading issue details...</div>
    );

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="max-w-5xl mx-auto p-6  flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 p-4 border-r">
          <h2 className="text-3xl font-bold text-buttons mb-4">
            Issue Details
          </h2>
          <div className="flex mt-8">
            <div className="flex w-1/2 flex-col ">
              <p className="text-sm text-gray-500">Title</p>
              <p className="text-black  text-lg">{dispute.title}</p>
            </div>

            <div className="flex  w-1/2 flex-col ml-8">
              <p className="text-sm text-gray-500">Invoice Number</p>
              <p className="text-black text-lg">{dispute.invoice_number}</p>
            </div>
          </div>

          <div className="flex mt-6 flex-col">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-black text-lg">{dispute.description}</p>
          </div>
          <div className="flex mt-6 gap-52">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Reason</p>
              <p className="text-black text-lg">{dispute.reason}</p>
            </div>

            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={` text-lg ${
                  dispute.status === "pending"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {dispute.status}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 bg-[#E9F5F9]">
          <div className="h-[70vh] overflow-y-auto p-3 rounded flex flex-col">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`mb-4 p-3 border rounded-lg max-w-[80%] ${
                  comment.user_id === currentUser
                    ? "ml-auto bg-[#fff] text-black"
                    : "mr-auto bg-gray-100 text-black"
                }`}
              >
                <p className="text-sm text-[#007bff] font-bold">
                  {comment.users?.name}
                </p>
                <p>{comment.message}</p>
                <p className="text-xs text-buttons pt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 text-black border p-2 rounded"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="ml-2 bg-buttons text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={sendComment}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
