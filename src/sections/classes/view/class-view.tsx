import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { ClassList } from "../class-list";
import { ClassListResponse } from "src/types/classes";
import { useEffect, useState } from "react";
import { getClasses } from "src/api/classes";

export function ClassesView() {
    const [response, setResponse] = useState<ClassListResponse | null>(null);
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await getClasses();
                setResponse(data);
            } catch (err) {
                console.error('Không thể tải danh sách lớp học.');
            }
        };

        fetchClasses();
    }, []);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Lớp học"
                links={[
                    { name: 'Tổng quan', href: paths.dashboard.root },
                    { name: 'Lớp học' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <ClassList classes={response} />
        </DashboardContent>
    );
}