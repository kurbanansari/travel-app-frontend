"use client";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "@/redux/thunk/userThunk";
import { RootState, AppDispatch } from "@/redux/store";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBox() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { results, loading, error } = useSelector(
    (state: RootState) => state.search
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return; // skip empty
    const handler = setTimeout(() => {
      dispatch(searchUsers({ search: query }));
    }, 500); // wait 500ms after typing stops
    return () => clearTimeout(handler); // cleanup on new keystroke
  }, [query, dispatch]);

  const goToUserProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl border border-green-200 bg-white p-6">
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Search users..."
             value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {loading && <p className="text-gray-500">Searching...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {results.length > 0 && (
            <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto">
              {results.map((u) => (
                <li
                  key={u.id}
                   onClick={() => goToUserProfile(u.id)}
                  className="px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition"
                >
                  {u.name}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
