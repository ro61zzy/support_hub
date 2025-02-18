"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";


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
    <div className="h-[100%] sm:h-[100vh] md:h-[100vh] lg:h-[100%] xl:h-[100vh] flex flex-col  sm:p-4 items-center justify-start bg-white">
      <div className="max-w-5xl  p-4 flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl sm:text-3xl font-bold text-buttons mb-4">Issue Details</h2>

          <div className="flex flex-row  mt-8 gap-24">
            <div className="flex flex-col md:w-1/2">
              <p className="text-[11px] sm:text-sm text-gray-500">Title</p>
              <p className="text-black text-[14px] sm:text-lg" >{dispute.title}</p>
            </div>

            <div className="flex flex-col  md:w-1/2 sm:mt-4 md:mt-0 ">
              <p className="text-[11px] sm:text-sm text-gray-500">Invoice No:</p>
              <p className="text-black text-[14px]">{dispute.invoice_number}</p>
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <p className="text-[11px] sm:text-sm text-gray-500">Description</p>
            <p className="text-black text-[14px]">{dispute.description}</p>
          </div>

          <div className="flex flex-row mt-6 gap-24 sm:gap-24">
            <div className="flex flex-col md:w-1/2">
              <p className="text-[11px] sm:text-sm text-gray-500">Reason</p>
              <p className="text-black text-[14px]">{dispute.reason}</p>
            </div>

            <div className="flex flex-col md:w-1/2">
              <p className="text-[11px] sm:text-sm text-gray-500">Status</p>
              <span
                className={`text-[14px] ${
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

        <div className="w-full mt-4 sm:mt-0 md:w-1/2 p-4 bg-[#E9F5F9]">
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
                <p className="text-sm sm:text-base">{comment.message}</p>
                <p className="text-xs text-buttons pt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col md:flex-row">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 text-black border p-2 rounded mb-4 md:mb-0"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="bg-buttons text-white px-4 py-2 rounded hover:bg-blue-600"
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
