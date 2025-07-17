import { Box, Divider, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ClassItem } from "src/types/classes";

type Props = DrawerProps & {
    classItem: ClassItem;
    onClose: () => void;
};

export function ClassDetails({ classItem, open, onClose, ...other }: Props) {
    const classProperties = () => (
        <Stack spacing={1.5}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'subtitle2',
                    justifyContent: 'space-between',
                }}
            >
                Chi tiết lớp học
            </Box>

            {classItem && (
                <>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Mô tả
                        </Box>

                        {classItem?.description}
                    </Box>

                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Khối lớp
                        </Box>

                        {classItem?.grade}
                    </Box>
                </>
            )}
        </Stack>
    );

    const teacherProperties = () => (
        <Stack spacing={1.5}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'subtitle2',
                    justifyContent: 'space-between',
                }}
            >
                Chi tiết giáo viên chủ nhiệm
            </Box>

            {classItem?.homeroomTeacher && (
                <>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Họ và tên
                        </Box>

                        {classItem?.homeroomTeacher.lastName} {classItem?.homeroomTeacher.firstName}
                    </Box>

                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Bằng cấp
                        </Box>

                        {classItem?.homeroomTeacher.teacherProfile.degree}
                    </Box>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Giới tính
                        </Box>

                        {classItem?.homeroomTeacher.gender === 'MALE' ? 'Nam' : 'Nữ'}
                    </Box>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Số điện thoại
                        </Box>

                        {classItem?.homeroomTeacher.phone}
                    </Box>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Email
                        </Box>
                        {classItem?.homeroomTeacher.email}
                    </Box>
                </>
            )}
        </Stack>
    );

    return (
        <>
            <Drawer
                open={open}
                onClose={onClose}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                    paper: { sx: { width: 320 } },
                }}
                {...other}
            >
                <Scrollbar>
                    <Stack
                        spacing={2.5}
                        sx={{ p: 2.5, justifyContent: 'center', bgcolor: 'background.neutral' }}
                    >
                        <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                            {classItem?.name}
                        </Typography>
                    </Stack>
                    <Stack
                        spacing={2.5}
                        sx={{ p: 2.5, justifyContent: 'center' }}
                    >
                        {classProperties()}
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        {teacherProperties()}
                    </Stack>
                </Scrollbar>
            </Drawer>
        </>
    );
}