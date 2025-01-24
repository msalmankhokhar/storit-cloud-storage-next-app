"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';
import { useDebounce } from 'use-debounce';

export default function Search() {

  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);
  
  useEffect(() => {
    const fetchFiles = async()=>{
      if(debouncedQuery.length === 0){
        setOpen(false);
        setResults([]);
        return router.push(path.replace(searchParams.toString(), ''));
      }
      const files = await getFiles({types: [], searchText: debouncedQuery})
      setResults(files.documents);
      setOpen(true);
    }
    fetchFiles();
  }, [debouncedQuery])

  useEffect(() => {
    if(!searchQuery) setQuery('')
  }, [])
  
  const handleClickItem = (file: Models.Document)=>{
    setOpen(false);
    setResults([]);
    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  }

  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image
          alt='search'
          src={'/jsm-assets/icons/search.svg'}
          width={24}
          height={24}
        />
        <Input
          type='text'
          className='search-input'
          placeholder='Search...'
          value={query}
          onChange={event=> setQuery(event.target.value)}
        />
        {
          open && (
            <ul className='search-result'>
              {
                results.length > 0 ? (
                  results.map(result=> (
                    <li className='flex items-center justify-between' key={result.$id} onClick={()=> handleClickItem(result)}>
                      <div className='flex cursor-pointer items-center gap-4'>
                        <Thumbnail type={result.type} extension={result.extension} url={result.url} className='size-9 min-w-9' />
                        <p className='subtitle-2 line-clamp-1 text-light-100'>{result.name}</p>
                      </div>
                      <FormattedDateTime className='caption line-clamp-1 text-light-200' date={result.$createdAt} />
                    </li>
                  ))
                ) : (
                  <p className='empty-result'>No files found</p>
                )
              }
            </ul>
          )
        }
      </div>
    </div>
  )
}
