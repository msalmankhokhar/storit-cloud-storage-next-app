'use client';
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from './Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';

interface props {
  ownerId: string;
  accountId: string;
  className?: string;
}

export default function FileUploader({ownerId, accountId, className}: props) {

  const [files, setFiles] = useState<File[]>([]);
  const {toast} = useToast();
  const path = usePathname();

  const onDrop = useCallback( async(acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(acceptedFiles);
    const uploadPromises = acceptedFiles.map(async(file)=> {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles)=> 
          prevFiles.filter((f)=> f.name != file.name)
        )
        return toast({
          description: (
            <p className='body-2 text-white'>
              <span className='font-semibold'>{file.name}</span> is too large. Max file size is 50 MB
            </p>
          ), className: 'error-toast',
        })
      }
      return uploadFile({
        file,
        ownerId,
        accountId,
        path,
      }).then((uploadedFile)=> {
        if (uploadedFile) {
          setFiles((prevFiles)=> 
            prevFiles.filter((f)=> f.name != file.name)
          )
        }
      })
    })
    await Promise.all(uploadPromises);
  }, [ownerId, accountId, path])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleRemoveFile = (event: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string)=>{
    event.stopPropagation();
    setFiles((prevFiles)=> 
      prevFiles.filter((file)=> file.name != fileName)
    )
  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn('uploader-button', className)}>
        <Image
          alt='upload'
          src={'/jsm-assets/icons/upload.svg'}
          width={24}
          height={24}
          className=''
        />
        <p>Upload</p>
      </Button>
      {
        (files.length > 0) && (
          <ul className='uploader-preview-list'>
            <h4 className='h4 text-light-100'>Uploading</h4>
            {
              files.map((file, index)=> {
                const {type, extension} = getFileType(file.name);
                return (
                  <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                    <div className='flex items-center gap-3'>
                      <Thumbnail
                        type={type}
                        extension={extension} 
                        url={convertFileToUrl(file)}
                      />
                      <div className='preview-item-name'>
                        {file.name}
                        <Image
                          alt='loader'
                          src={'/jsm-assets/icons/file-loader.gif'}
                          width={80}
                          height={26}
                        />
                      </div>
                    </div>
                    <Image
                      alt='remove'
                      src={'/jsm-assets/icons/remove.svg'}
                      width={24}
                      height={24}
                      onClick={(event)=> handleRemoveFile(event, file.name)}
                    />
                  </li>
                )
              })
            }
          </ul>
        )
      }
      {/* {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag & drop some files here, or click to select files</p>
      } */}
    </div>
  )
}
