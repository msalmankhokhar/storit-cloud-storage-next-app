import { cn, getFileIcon } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

interface props {
    type: string;
    extension: string;
    url?: string;
    imageClassName?: string;
    className?: string;
}

export default function Thumbnail({ type, extension, url = '', imageClassName, className }: props) {
    const isImage = type === 'image' && extension != 'svg';
    return (
        <figure className={cn('thumbnail', className)}>
            <Image
                alt='thumbnail'
                src={isImage ? url : getFileIcon(extension, type)}
                width={100}
                height={100}
                className={cn('size-8, object-contain', imageClassName, isImage && 'thumbnail-image' )}
            />
        </figure>
    )
}
