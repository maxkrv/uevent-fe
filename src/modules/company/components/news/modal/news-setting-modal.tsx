import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CompanyNews } from '@/modules/company/interfaces/news.interface';
import { CompanyService } from '@/modules/company/services/company.service';
import { ConfirmModal } from '@/shared/components/common/confirm-modal';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { QueryKeys } from '@/shared/constants/query-keys';

import { EditNewsForm } from '../forms/edit-news-form';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  news: CompanyNews;
}

export const NewsSettingModal: FC<Props> = ({ open, setOpen, news }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: () => CompanyService.deleteNewsItem(news.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, news.id] });
      navigate(`/companies/${news.company.id}`);
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{news.title}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="edit">
            <TabsList className="w-full">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <EditNewsForm news={news} onSuccess={() => setOpen(false)} />
            </TabsContent>

            <TabsContent value="danger">
              <Button variant="destructive" onClick={() => setOpenConfirm(true)}>
                <Trash /> Delete news
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
