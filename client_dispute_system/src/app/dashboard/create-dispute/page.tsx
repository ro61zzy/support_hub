"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CreateDisputePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Fetch the current user
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      setErrorMessage("You must be logged in to create a dispute.");
      return;
    }

    // Insert the dispute into the database
    const { error: insertError } = await supabase.from("disputes").insert([
      {
        title,
        description,
        category,
        user_id: user.id, // Save the dispute under the logged-in user
        status: "pending", // Default status
        created_at: new Date(),
      },
    ]);

    if (insertError) {
      setErrorMessage("Error creating dispute. Please try again.");
      return;
    }

    router.push("/dashboard"); // Redirect to the dashboard after submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create a New Dispute</h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <select
          className="w-full border p-3 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Billing">Billing</option>
          <option value="Service Issue">Service Issue</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Submit Dispute
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
