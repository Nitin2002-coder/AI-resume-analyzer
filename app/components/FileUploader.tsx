import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;



    return (
        <div className={`upload-shell ${isDragActive ? "is-dragging" : ""}`}>
            <div {...getRootProps()} className="uplader-drag-area">
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <div className="file-icon">PDF</div>
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                onFileSelect?.(null)
                            }}>
                                <span className="text-xl leading-none">x</span>
                            </button>
                        </div>
                    ): (
                        <div>
                            <div className="upload-orb mx-auto mb-4">
                                <span>^</span>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">PDF only, max {formatSize(maxFileSize)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
