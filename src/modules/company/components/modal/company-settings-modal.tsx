import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfirmModal } from '@/shared/components/common/confirm-modal';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { QueryKeys } from '@/shared/constants/query-keys';

import { Company } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';
import { CompanyPromoCode } from '../company-promo-code';
import { EditCompanyForm } from '../forms/edit-company-form';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  company: Company;
}

export const CompanySettingsModal: FC<Props> = ({ open, setOpen, company }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigation = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => CompanyService.delete(company.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      navigation('/companies');
      setOpen(false);
      setOpenConfirm(false);
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{company.name} Settings</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="edit">
            <TabsList className="w-full">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="promo">Promo Codes</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <EditCompanyForm company={company} onSuccess={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="promo">
              <CompanyPromoCode companyId={company.id} />
            </TabsContent>
            <TabsContent value="danger">
              <Button variant="destructive" onClick={() => setOpenConfirm(true)}>
                <Trash /> Delete Company
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => mutate()}
        isLoading={isPending}
        title="Delete Company"
        description="Are you sure you want to delete this company? This action cannot be undone."
      />
    </>
  );
};
