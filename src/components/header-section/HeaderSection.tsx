import { Box, Stack } from "@mui/material";
import { ReactNode } from "react";
import { CONFIG } from "src/global-config";
import { CustomBreadcrumbs } from "../custom-breadcrumbs";

type BreadcrumbLink = {
    name: string;
    href?: string;
};

type HeaderSectionProps = {
    heading: string;
    links: BreadcrumbLink[];
    actions?: ReactNode;
};

export default function HeaderSection({ heading, links, actions }: HeaderSectionProps) {
    return (
        <Box
            sx={{
                position: 'relative',
                my: { xs: 2, md: 3 },
                px: 4,
                py: 2,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundImage: `url("${CONFIG.assetsDir}/assets/background/header-sec.jpg")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
                boxShadow: 5,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                flexWrap="wrap"
            >
                <CustomBreadcrumbs heading={heading} links={links} />

                {actions && <Stack direction="row" spacing={1}>{actions}</Stack>}
            </Stack>
        </Box>
    );
}