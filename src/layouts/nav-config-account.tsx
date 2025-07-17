import { Iconify } from 'src/components/iconify';

import type { AccountDrawerProps } from './components/account-drawer';

// ----------------------------------------------------------------------

export const _account: AccountDrawerProps['data'] = [
  { label: 'Trang chủ', href: '/', icon: <Iconify icon="solar:home-angle-bold-duotone" /> },
  {
    label: 'Thông tin cá nhân',
    href: '#',
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: 'Đổi mật khẩu',
    href: '#',
    icon: <Iconify icon="solar:notes-bold-duotone" />,
  },
];
