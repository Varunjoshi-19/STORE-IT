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


interface UploaderPayload {
  ownerId: string;
  accountId: string;
  className?: string;
}


function FileUploder({ ownerId, accountId, className }: UploaderPayload) {

  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const path = usePathname();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    setFiles(acceptedFiles);

    // upload file logic here 

    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

        return toast({
          description: (
            <p className='body-2 text-white'>
              <span className='font-semibold'>{file.name}</span>
              is too large. Max file size is 50MB.
            </p>
          ),
          className: "error-toast"
        })
      }

      return uploadFile({ file, ownerId, accountId, path }).then((uploadedFile) => {
        if (uploadedFile) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
        }
      })


    })
    await Promise.all(uploadPromises);

  }, [ownerId, accountId, path]);


  const { getRootProps, getInputProps  } = useDropzone({ onDrop })


  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement>, fileName: string) => {
    e.stopPropagation();

    setFiles((prevFiles) => prevFiles.filter((file) => file.name != fileName));

  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn('uploader-button',)}>

        <Image
          src="/assets/icons/upload.svg"
          alt='upload'
          width={24}
          height={24}
        />
        <p>Upload</p>

      </Button>

      {
        files.length > 0 && (
          <ul className='uploader-preview-list'>
            <h4 className='h4 text-light-100'>Uploading</h4>

            {files.map((file: File, index: number) => {
              const { type, extension } = getFileType(file.name);

              return (
                <li className='uploader-preview-item'
                  key={`${file.name}-${index}`}>

                  <div className='flex item-center gap-3'>
                    <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />

                    <div className='preview-item-name'>
                      {file.name}
                      <Image
                        src="/assets/icons/file-loader.gif"
                        alt='Loader'
                        width={80}
                        height={26}
                      />
                    </div>
                  </div>

                  <Image

                    src="/assets/icons/remove.svg"
                    alt='Remove'
                    width={24}
                    height={24}
                    onClick={(e) => handleRemoveFile(e, file.name)}
                  />

                </li>
              )

            })



            }
          </ul>
        )
      }


    </div>
  )
}

export default FileUploder
