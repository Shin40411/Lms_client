import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { ClassList } from "../class-list";
import { ClassItem, ClassListResponse } from "src/types/classes";
import { useCallback, useEffect, useState } from "react";
import { deleteClass, getClasses, searchClasses } from "src/api/classes";
import { Box, Button, InputAdornment, Popover, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { toast } from 'src/components/snackbar';
import { Iconify } from "src/components/iconify";
import { ClassForm } from "../class-form";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useBoolean } from "minimal-shared/hooks";
import { getUsers } from "src/api/users";
import { SkeletonScreen } from "src/components/skeleton/skeleton";
import { EmptyContent } from "src/components/empty-content";
import { CONFIG } from "src/global-config";

export function ClassesView() {
    const [open, setOpen] = useState<null | HTMLElement>(null);
    const [selectedClass, setSelectedClass] = useState<ClassItem | undefined>(undefined);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [response, setResponse] = useState<ClassListResponse | null>(null);
    const confirmDelete = useBoolean();

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const [teachers, setTeachers] = useState([
        { id: '', name: '' }
    ]);

    const [students, setStudents] = useState([
        { id: '', name: '' }
    ]);


    const fetchClasses = async () => {
        try {
            const data = await getClasses();
            setResponse(data);
        } catch (err) {
            console.error('Không thể tải danh sách lớp học.');
        }
    };

    const fetchTeachers = async () => {
        try {
            const data = await getUsers('?isTeacher=true');
            setTeachers(
                data.results.map((item) => ({
                    id: item.id,
                    name: item.lastName + ' ' + item.firstName,
                }))
            );
        } catch (err) {
            console.error('Không thể tải danh sách giáo viên.');
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await getUsers('?isStudent=true&hasClassroom=false');
            setStudents(
                data.results.map((item) => ({
                    id: item.id,
                    name: item.lastName + ' ' + item.firstName,
                }))
            );
        } catch (err) {
            console.error('Không thể tải danh sách học sinh.');
        }
    };

    const fetchSearchClasses = async (keyWord: string) => {
        try {
            const data = await searchClasses(keyWord);
            setResponse(data);
        } catch (err) {
            console.error('Không thể tải danh sách lớp học.');
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
        fetchStudents();
    }, []);

    const handleEdit = (classItem: ClassItem) => {
        setSelectedClass(classItem);
    };

    const handleDelete = (id: string) => {
        setSelectedId(id);
        confirmDelete.onTrue();
    };

    const deleteAction = async () => {
        if (selectedId) {
            try {
                await deleteClass(selectedId);
                fetchClasses();
                fetchTeachers();
                fetchStudents();
                confirmDelete.onFalse();
                setSelectedId(null);
                toast.success('Xóa lớp học thành công');
            } catch (err) {
                console.log(err);
                toast.error('Đã có lỗi xảy ra');
            }
        } else {
            toast.warning('Dữ liệu không phù hợp để xóa');
        }
    };

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDelete.value}
            onClose={confirmDelete.onFalse}
            title="Xóa lớp học"
            content={
                <>
                    Bạn có chắc chắn muốn xóa lớp học này?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteAction}
                >
                    Xóa
                </Button>
            }
        />
    );

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue)
            fetchSearchClasses(newValue);
        else
            fetchClasses();
    }, [fetchSearchClasses, fetchClasses]);

    return (
        <DashboardContent>
            <Box
                sx={{
                    my: { xs: 2, md: 3 },
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.mode === 'light'
                        ? '#E3F2FD'
                        : theme.palette.background.paper,
                    backgroundImage: `url("${CONFIG.assetsDir}/assets/background/shape-square.svg")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right',
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    flexWrap="wrap"
                >
                    <CustomBreadcrumbs
                        heading="Lớp học"
                        links={[
                            { name: 'Tổng quan', href: paths.dashboard.root },
                            { name: 'Lớp học' },
                        ]}
                    />

                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="fluent-color:document-add-16" />}
                        sx={{ mt: { xs: 2, md: 0 } }}
                        onClick={(e) => { handleOpen(e), setSelectedClass(undefined) }}
                    >
                        Thêm mới
                    </Button>
                </Stack>
            </Box>

            <Box sx={{
                bgcolor: (theme) => theme.palette.mode === 'light'
                    ? '#FFF'
                    : theme.palette.background.paper,
                p: 2,
                boxShadow: 5,
                borderRadius: 2
            }}>
                <Box
                    sx={{
                        py: 2,
                        gap: 2,
                        display: 'flex',
                        pr: { xs: 2.5, md: 1 },
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-end', md: 'center' },
                    }}
                >
                    <Box
                        sx={{
                            gap: 2,
                            width: 1,
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm..."
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            onChange={handleSearch}
                        />
                    </Box>
                </Box>
                {response ? (
                    response.count === 0 ? (
                        <EmptyContent title="Chưa có lớp học nào" sx={{ p: 5 }} description="Hãy bắt đầu tạo lớp học đầu tiên của bạn để quản lý học sinh và giáo viên." />
                    ) : (
                        <ClassList
                            classes={response}
                            openEdit={handleOpen}
                            onEdit={handleEdit}
                            confirmDelete={confirmDelete}
                            onDelete={handleDelete}
                        />
                    )
                ) : (
                    <SkeletonScreen />
                )}
            </Box>

            {Boolean(open) && (
                <Box
                    onClick={handleClose}
                    sx={{
                        zIndex: 1300,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                    }}
                />
            )}

            <Popover
                open={Boolean(open)}
                anchorReference="anchorPosition"
                anchorPosition={{ top: window.innerHeight / 2, left: window.innerWidth / 2 }}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                PaperProps={{
                    sx: {
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        width: 700,
                        maxWidth: '100%',
                        zIndex: 1400,
                    },
                }}
            >
                <ClassForm
                    teachers={teachers}
                    currentClass={selectedClass}
                    students={students}
                    handleClose={handleClose}
                    resetResponse={setResponse}
                    resetTeachers={setTeachers}
                    resetStudents={setStudents}
                />
            </Popover>
            {renderConfirmDialog()}
        </DashboardContent>
    );
}