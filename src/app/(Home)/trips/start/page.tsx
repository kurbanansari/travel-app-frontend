"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartTripPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/trips/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // store token after login
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to start trip");

      const data = await res.json();
      alert("Trip started!");
      router.push(`/trips/${data.id}`); // go to trip details
    } catch (err) {
      console.error(err);
      alert("Error starting trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6"
      >
        <h1 className="text-xl font-bold mb-4">Start a New Trip</h1>
        <input
          type="text"
          placeholder="Trip Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Starting..." : "Start Trip"}
        </button>
      </form>
    </div>
  );
}
