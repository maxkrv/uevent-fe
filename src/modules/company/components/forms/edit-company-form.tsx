import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { AddressAutocomplete } from '@/shared/components/common/address-autocomplete';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';
import { LocationDto } from '@/shared/types/maps';

import { Company, CompanyDto, CompanySchema } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';

interface Props {
  company: Company;
  onSuccess?: () => void;
}

export const EditCompanyForm: FC<Props> = ({ company, onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid }
  } = useForm<CompanyDto>({
    resolver: zodResolver(CompanySchema),
    defaultValues: company,
    mode: 'all'
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CompanyDto) => CompanyService.update(company.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANIES, company.id] });
      onSuccess?.();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input {...register('name')} id="name" placeholder="Enter company name" errorMessage={errors.name?.message} />
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

      <AddressAutocomplete onAddressSelect={handleAddressChange} defaultValue={company.location} />

      <Button type="submit" disabled={!isValid || isPending} isLoading={isPending}>
        Edit
      </Button>
    </form>
  );
};
