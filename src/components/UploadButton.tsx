'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild={true}>
                <Button>Upload PDF</Button>
            </DialogTrigger>

            <DialogContent>example content</DialogContent>
        </Dialog>
    );
};

export default UploadButton;
