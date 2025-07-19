import type { UserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Dialog, DialogTitle } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  avatarUrl: schemaHelper.file({ message: 'Ảnh đại diện là bắt buộc!' }),

  firstName: zod.string().min(1, { message: 'Họ và tên là bắt buộc!' }),

  email: zod
    .string()
    .min(1, { message: 'Email là bắt buộc!' })
    .email({ message: 'Email không hợp lệ!' }),

  phone: zod.string().min(1, { message: 'Số điện thoại là bắt buộc!' }),

  dob: zod.union([zod.date(), zod.null()]).optional(),

  gender: zod.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính là bắt buộc!' }),
  }),

  status: zod.enum(['ACTIVE', 'INACTIVE']),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser: UserItem | null;
  open: boolean;
  onClose: () => void;
};

export function UserNewEditForm({ currentUser, open, onClose }: Props) {
  const router = useRouter();

  const defaultValues: NewUserSchemaType = {
    avatarUrl: null,
    firstName: '',
    email: '',
    phone: '',
    dob: null,
    gender: 'OTHER',
    status: 'ACTIVE',
  };

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues: currentUser
      ? {
        ...defaultValues,
        ...{
          avatarUrl: currentUser.avatar,
          firstName: currentUser.firstName,
          email: currentUser.email,
          phone: currentUser.phone,
          dob: currentUser.dob ? new Date(currentUser.dob) : null,
          gender: currentUser.gender,
          teacherProfile: Boolean(currentUser.teacherProfile),
          status: currentUser.status,
        },
      }
      : defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 1440 },
        },
      }}
    >
      <DialogTitle>{currentUser ? 'Chỉnh sửa thông tin người dùng' : 'Thêm thông tin người dùng'}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              {currentUser && (
                <Label
                  color={
                    (values.status === 'ACTIVE' && 'success') ||
                    (values.status === 'INACTIVE' && 'error') ||
                    'warning'
                  }
                  sx={{ position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status === 'ACTIVE' ? (
                    <>
                      <Iconify icon="ri:account-circle-fill" color='#4e42d9' width={24} height={24} /> Đang hoạt động
                    </>
                  ) : (
                    <>
                      <Iconify icon="material-symbols-light:account-circle-off-rounded" color='#000' width={24} height={24} /> Không hoạt động
                    </>
                  )}
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <Field.UploadAvatar
                  name="avatarUrl"
                  maxSize={3145728}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Cho phép *.jpeg, *.jpg, *.png, *.gif
                      <br /> Kích thước tối đa {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              {currentUser && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value === 'INACTIVE'}
                          onChange={(event) => field.onChange(event.target.checked ? 'INACTIVE' : 'ACTIVE')}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Vô hiệu hóa
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Áp dụng vô hiệu hóa người dùng này
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    mb: 3,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />
              )}

              {/* <Field.Switch
                name="isVerified"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Xác minh email
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    </Typography> 
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              /> */}

              {currentUser && (
                <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant="soft" color="error" startIcon={<Iconify icon="fluent-color:person-warning-48" />}>
                    Xóa người dùng
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="firstName" label="Họ và tên" />
                <Field.Text name="email" label="Địa chỉ email" />
                <Field.Phone
                  name="phone"
                  label="Số điện thoại"
                  disableSelect
                />

                <Field.DatePicker
                  name="dob"
                  label="Ngày sinh"
                />

                <Field.RadioGroup name="gender" label='Giới tính' options={[
                  { label: "Nam", value: "MALE" },
                  { label: "Nữ", value: "FEMALE" },
                  { label: "Khác", value: "OTHER" }
                ]} />

                {/* <Field.Switch name="teacherProfile" labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Bạn là giáo viên?
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                /> */}
              </Box>

            </Card>
            <Stack direction="row" justifyContent="flex-end" sx={{ p: 4, alignItems: 'flex-end' }}>
              <Button variant="outlined" color="inherit" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button type="submit" variant="contained" sx={{ ml: 1 }} loading={isSubmitting}>
                {!currentUser ? 'Thêm dữ liệu' : 'Lưu thay đổi'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </Dialog>
  );
}
