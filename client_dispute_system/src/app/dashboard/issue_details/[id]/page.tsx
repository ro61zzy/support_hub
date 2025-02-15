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

    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select(
          `
          id, 
          dispute_id, 
          user_id, 
          message, 
          created_at, 
          users:users!comments_user_id_fkey(name)
        `
        )
        .order("created_at", { ascending: true });

        const formattedData = data?.map((comment) => ({
            ...comment,
            users: comment.users?.[0] || null, // Extract first user or set to null
          })) ?? [];
        
          setComments(formattedData);
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

    if (!error) setNewComment("");
  };

  if (!dispute)
    return (
      <div className="text-center text-gray-600">Loading issue details...</div>
    );

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="max-w-5xl mx-auto p-6  flex flex-col md:flex-row w-full">
        {/* Left: Issue Details */}
        <div className="w-full md:w-1/2 p-4 border-r">
  <h2 className="text-3xl font-bold text-blue-500 mb-4">Issue Details</h2>
<div className="flex mt-8 gap-30">

  <div className="flex w-1/2 flex-col">
    <p className="text-lg text-gray-500">Title</p>
    <p className="text-black  text-2xl">{dispute.title}</p>
  </div>

  <div className="flex  w-1/2 flex-col">
    <p className="text-lg text-gray-500">Invoice Number</p>
    <p className="text-black text-2xl">{dispute.invoice_number}</p>
  </div>
</div>

  <div className="flex mt-6 flex-col">
    <p className="text-lg text-gray-500">Description</p>
    <p className="text-black text-2xl">{dispute.description}</p>
  </div>
<div className="flex mt-6 gap-52">

  <div className="flex flex-col">
    <p className="text-lg text-gray-500">Reason</p>
    <p className="text-black text-2xl">{dispute.reason}</p>
  </div>

  <div className="flex flex-col">
    <p className="text-lg text-gray-500">Status</p>
    <span className="px-2 text-black py-1 rounded">{dispute.status}</span>
  </div>
</div>
</div>


        {/* Right: Chat/Log Section */}
        <div className="w-full md:w-1/2 p-4">
          <div className="h-[70vh] overflow-y-auto bg-gray-200 p-3 rounded flex flex-col">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`mb-4 p-3 border rounded-lg max-w-[80%] ${
                  comment.user_id === currentUser
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 text-black"
                }`}
              >
                <p className="text-sm font-bold">{comment.users?.name}</p>
                <p>{comment.message}</p>
                <p className="text-xs text-gray-300">
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
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
