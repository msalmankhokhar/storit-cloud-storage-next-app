import React from 'react'
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import FileCard from '@/components/FileCard';
import { getFileTypesParams } from '@/lib/utils';

export default async function FileType({searchParams, params}: SearchParamProps) {
    const type = (await params)?.fileType as string || '';
    const searchText = ((await searchParams)?.query) as string || '';
    const sort = ((await searchParams)?.sort) as string || '';
    const types = getFileTypesParams(type) as FileType[];
    const files = await getFiles({types, searchText, sort});
    return (
        <div className='page-container'>
            <section className='w-full '>
                <h1 className='h1 capitalize'>{type}</h1>
                <div className='total-size-section'>
                    <p className='body-1'>
                        Total: <span className='h5'>{'totalSize'}</span>
                    </p>
                    <div className='sort-container'>
                        <p className='body-1 hidden sm:block text-light-200 line-clamp-1 w-full'>Sort by</p> 
                        <Sort />
                    </div>
                </div>
            </section>
            {/* Render the files */}
            {
                files.total > 0 ? (
                    <section className='file-list'>
                        {
                            files.documents.map((file:Models.Document)=>(
                                <FileCard key={file.$id} file={file} />
                            ))
                        }
                    </section>
                ) : (
                    <p className='empty-list'>No files uploaded</p>
                )
            }
        </div>
    )
}
