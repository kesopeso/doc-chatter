'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Dropzone from 'react-dropzone';
import { Cloud, File } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

const UploadDropzone = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { startUpload } = useUploadThing('pdfUploader');

    const { mutate: getFile } = trpc.getFile.useMutation({
        onSuccess: (file) => {
            router.push(`/dashboard/${file.id}`);
        },
        retry: true,
        retryDelay: 500,
    });

    const startSimulatedProgress = () => {
        setUploadProgress(0);
        setShowProgressBar(true);

        const interval = setInterval(() => {
            setUploadProgress((currentUploadProgress) => {
                if (currentUploadProgress >= 95) {
                    clearInterval(interval);
                    return currentUploadProgress;
                }

                return currentUploadProgress + 5;
            });
        }, 500);

        const finishSimulatedProgress = (options?: { reset: boolean }) => {
            clearInterval(interval);

            const shouldReset = options?.reset || false;
            if (shouldReset) {
                setShowProgressBar(false);
                setUploadProgress(0);
                return;
            }

            setUploadProgress(100);
        };

        return finishSimulatedProgress;
    };

    return (
        <Dropzone
            multiple={false}
            onDrop={async (acceptedFile) => {
                const finishSimulatedProgress = startSimulatedProgress();

                const res = await startUpload(acceptedFile);

                if (!res) {
                    finishSimulatedProgress({ reset: true });
                    return toast({
                        title: 'Something went wrong',
                        description: 'Please try again later',
                        variant: 'destructive',
                    });
                }

                const [fileResponse] = res;
                const key = fileResponse?.key;

                if (!key) {
                    finishSimulatedProgress({ reset: true });
                    toast({
                        title: 'Something went wrong',
                        description: 'Please try again later',
                        variant: 'destructive',
                    });
                }

                finishSimulatedProgress();

                getFile({ key });
            }}
        >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                    {...getRootProps()}
                    className="m-4 h-64 rounded-lg border border-dashed border-gray-300"
                >
                    <div className="flex h-full w-full items-center justify-center">
                        <label
                            htmlFor="dropzone-file"
                            className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                                <p className="mb-2 text-sm text-zinc-700">
                                    <span className="font-semibold">
                                        Click to upload
                                    </span>{' '}
                                    or drag and drop
                                </p>
                                <p className="text-xs text-zinc-500">
                                    PDF (up to 4MB)
                                </p>
                            </div>

                            {!!acceptedFiles && !!acceptedFiles[0] && (
                                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                                    <div className="grid h-full place-items-center px-3 py-2">
                                        <File className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="h-full truncate px-3 py-2 text-sm">
                                        {acceptedFiles[0].name}
                                    </div>
                                </div>
                            )}

                            {showProgressBar && (
                                <div className="mx-auto mt-4 w-full max-w-xs">
                                    <Progress
                                        value={uploadProgress}
                                        className="h-1 w-full bg-zinc-200"
                                    />
                                </div>
                            )}

                            <input
                                {...getInputProps()}
                                id="dropzone-file"
                                className="hidden"
                                type="file"
                            />
                        </label>
                    </div>
                </div>
            )}
        </Dropzone>
    );
};

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild={true}>
                <Button>Upload PDF</Button>
            </DialogTrigger>

            <DialogContent>
                <UploadDropzone />
            </DialogContent>
        </Dialog>
    );
};

export default UploadButton;
