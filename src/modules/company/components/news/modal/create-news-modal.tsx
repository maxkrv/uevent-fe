import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dropzone from 'shadcn-dropzone';

import { CompanyNewsDto, CompanyNewsSchema } from '@/modules/company/interfaces/news.interface';
import { CompanyService } from '@/modules/company/services/company.service';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  companyId: string;
  onSuccess?: () => void;
}

export const CreateNewsModal: FC<Props> = ({ open, setOpen, companyId, onSuccess }) => {
  const queryClient = useQueryClient();
  const [cover, setCover] = useState<File | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useForm<CompanyNewsDto>({
    resolver: zodResolver(CompanyNewsSchema),
    defaultValues: {
      companyId
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CompanyService.createNewsItem,
    onSuccess: ({ id }) => {
      if (cover) {
        updateCover(id);

        return;
      }

      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, companyId] });
      onSuccess?.();
    }
  });

  const { mutate: updateCover } = useMutation({
    mutationFn: (id: string) => CompanyService.updateNewsItemCover(id, cover!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, companyId] });
      onSuccess?.();
    }
  });

  const onSubmit = (data: CompanyNewsDto) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create news</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Name</Label>
            <Input
              {...register('title')}
              id="title"
              placeholder="Enter company name"
              errorMessage={errors.title?.message}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Cover</Label>
            <Dropzone
              accept={{ 'image/*': [] }}
              multiple={false}
              showFilesList={false}
              onDropAccepted={(files) => {
                setCover(files?.[0] || null);
              }}
              dropZoneClassName="w-full overflow-hidden">
              {() => (
                <>
                  {cover ? (
                    <img
                      src={URL.createObjectURL(cover)}
                      alt="cover"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <>Upload a cover</>
                  )}
                </>
              )}
            </Dropzone>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              {...register('content')}
              id="content"
              placeholder="Enter company name"
              errorMessage={errors.content?.message}
            />
          </div>

          <Button type="submit" disabled={!isValid || isPending} isLoading={isPending}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
