"use client";

import { useEffect, useState } from "react";

import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearchInput";
import SearchResults from "./SidebarSearchResult";
import ConversationList from "./ConversationList";
// import { toast } from "react-toastify";

type SidebarProps = {
  onSelectConversation: (userId: string) => void;
};

export default function Sidebar({ onSelectConversation }: SidebarProps) {

  const [query, setQuery] = useState("");


  return (
    <div className="w-full flex flex-col h-full overflow-x-hidden">
      {/* Header */}
      <SidebarHeader />
      {/* Search bar */}
      <div className="px-3 py-2 border-b w-full overflow-x-hidden">
       <SidebarSearch query={query} setQuery={setQuery}/>

        {/* Search results */}
        <SearchResults query={query} onSelectConversation={onSelectConversation} />
      </div>

      {/* Conversation list */}
       <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
    <ConversationList onSelectConversation={onSelectConversation} />
  </div>
    </div>
  );
}
