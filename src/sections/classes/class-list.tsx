import { Box, Pagination } from "@mui/material";
import { useCallback, useState } from "react";
import { ClassCard } from "./class-card";
import { ClassItem, ClassListResponse } from "src/types/classes";
import { UseBooleanReturn } from "minimal-shared/hooks";

type Props = {
    classes: ClassListResponse | null;
    onEdit: (classItem: ClassItem) => void;
    openEdit: (event: React.MouseEvent<HTMLElement>) => void;
    confirmDelete: UseBooleanReturn;
    onDelete: (id: string) => void;
};

export function ClassList({ classes, onEdit, confirmDelete, onDelete, openEdit }: Props) {
    const classItems = classes?.results ?? [];
    const [page, setPage] = useState(1);

    const rowsPerPage = 9;

    const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    }, []);

    return (
        <>
            <Box
                sx={{
                    gap: 3,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                }}
            >
                {classItems
                    .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                    .map((c) => (
                        <ClassCard
                            key={c.id}
                            classgr={c}
                            onEdit={onEdit}
                            openEdit={openEdit}
                            confirmDelete={confirmDelete}
                            onDelete={onDelete}
                        />
                    ))}
            </Box>

            <Pagination
                page={page}
                shape="circular"
                count={Math.ceil(classItems.length / rowsPerPage)}
                onChange={handleChangePage}
                sx={{
                    mt: { xs: 5, md: 8 },
                    mx: 'auto',
                    '.MuiPagination-ul': {
                        justifyContent: 'center',
                    },
                }}
            />
        </>
    );
}