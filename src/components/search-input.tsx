"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    router.push(pathname + "?" + createQueryString("q", searchValue));
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="hidden xl:flex items-center border border-border/70 bg-card/85 px-2 py-2 rounded-xl focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
        <Search size={18} className="text-muted-foreground" />
        <input
          className="outline-none px-2 text-sm bg-transparent placeholder:text-muted-foreground/80"
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </form>
  );
};

export default SearchInput;
