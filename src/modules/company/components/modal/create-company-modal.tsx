import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dropzone from 'shadcn-dropzone';
import { toast } from 'sonner';

import { AddressAutocomplete } from '@/shared/components/common/address-autocomplete';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';
import { cn } from '@/shared/lib/utils';
import { LocationDto } from '@/shared/types/maps';

import { CompanyDto, CompanySchema } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CreateCompanyModal: FC<Props> = ({ open, setOpen }) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid }
  } = useForm<CompanyDto>({
    resolver: zodResolver(CompanySchema),
    mode: 'all'
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: CompanyService.create,
    onSuccess: ({ id }) => {
      if (avatar || cover) {
        mutateMedia(id);

        return;
      }

      toast.success('Company created successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      setOpen(false);
    }
  });

  const { mutate: mutateMedia, isPending: isPendingMedia } = useMutation({
    mutationFn: (companyId: string) => {
      const promises = [];

      if (avatar) {
        promises.push(CompanyService.updateLogo(companyId, avatar));
      }

      if (cover) {
        promises.push(CompanyService.updateCover(companyId, cover));
      }

      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success('Company updated successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      setOpen(false);
    }
  });

  const handleAddressChange = (address: LocationDto) => {
    setValue('location.address', address.address);
    setValue('location.lat', address.lat);
    setValue('location.lng', address.lng);
  };

  const onSubmit = (data: CompanyDto) => {
    mutate(data);
  };

  const isLoading = isPending || isPendingMedia;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="Enter company name"
              errorMessage={errors.name?.message}
            />
          </div>

          <div className="grid gap-2 w-fit">
            <Label>Logo</Label>

            <div className="relative">
              <Avatar className="bg-muted border-2 h-16 w-16">
                <AvatarImage src={avatar ? URL.createObjectURL(avatar) : ''} />
              </Avatar>

              <div className="absolute -bottom-1 right-0">
                <Label
                  htmlFor="logo"
                  className={cn(buttonVariants({ size: 'sm' }), 'relative gap-0 rounded-full h-6 w-6')}>
                  <Upload className="h-2 w-2" />
                  <Input
                    type="file"
                    id="logo"
                    className="hidden h-0 w-0 absolute"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                  />
                </Label>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Cover</Label>

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
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Enter company description"
              errorMessage={errors.description?.message}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register('email')}
              id="email"
              placeholder="Enter company email"
              errorMessage={errors.email?.message}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              {...register('website')}
              id="website"
              placeholder="Enter company website"
              errorMessage={errors.website?.message}
            />
          </div>

          <AddressAutocomplete onAddressSelect={handleAddressChange} />

          <Button type="submit" disabled={!isValid || isLoading} isLoading={isLoading}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
