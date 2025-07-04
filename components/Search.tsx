'use client';

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormttedDateTime from './FormttedDateTime';
import { useDebounce } from 'use-debounce';

function Search() {

  const router = useRouter();
  const path = usePathname();
  const [query, setQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [debouncedQuery] = useDebounce(query, 1000);

  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const fetchFiles = async () => {

      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery })

      setResults(files.documents);
      setOpen(true);
    }
    fetchFiles();
  }, [debouncedQuery])


  useEffect(() => {

    if (!searchQuery) {
      setQuery("");
    }

  }, [searchQuery])


  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(`/${(file.type === 'video' || 'audio') ? 'media' : file.type + 's'}?query=${query}`);

  }



  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image
          src="/assets/icons/search.svg"
          alt='Search'
          width={24}
          height={24}
        />
        <Input value={query} placeholder='Search.......'
          className='search-input' onChange={(e) => setQuery(e.target.value)}
        />

        {open && (

          <ul className='search-result'>
            {
              results.length > 0 ? (
                results.map((file) => (
                  <li key={file.$id} onClick={() => handleClickItem(file)}
                    className='flex item-center justify-between'
                  >
                    <div className='flex cursor-pointer item-center gap-4'>
                      <Thumbnail
                        type={file.type}
                        extension={file.extension}
                        url={file.url}
                        className='size-9 min-w-9'
                      />
                      <p className='subtitle-2 line-clamp-1 text-light-100'>{file.name}</p>
                    </div>
                    <FormttedDateTime
                      date={file.$createdAt}
                      className='caption line-clamp-1'
                    />
                  </li>
                )))
                :
                (
                  <p>No files found</p>
                )
            }
          </ul>


        )}
      </div>
    </div >
  )
}

export default Search
