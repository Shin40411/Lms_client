import { Avatar, Box, Card, CardProps, Divider, IconButton, ListItemText, Typography } from "@mui/material";
import { varAlpha } from "minimal-shared/utils";
import { _socials } from "src/_mock";
import AvatarShape from "src/assets/illustrations/avatar-shape";
import { Iconify } from "src/components/iconify";
import { Image } from "src/components/image";
import { CONFIG } from "src/global-config";
import { ClassItem } from "src/types/classes";
import { fShortenNumber } from "src/utils/format-number";

type Props = CardProps & {
    classgr: ClassItem;
};

export function ClassCard({ classgr, sx, ...other }: Props) {
    return (
        <Card sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
            <Box sx={{ position: 'relative' }}>
                <AvatarShape
                    sx={{
                        left: 0,
                        // right: 0,
                        zIndex: 10,
                        mx: 'auto',
                        bottom: -26,
                        position: 'absolute',
                    }}
                />

                <Avatar
                    alt={classgr.name}
                    src={classgr.homeroomTeacher.user.avatar}
                    sx={{
                        left: 40,
                        // right: 0,
                        width: 64,
                        height: 64,
                        zIndex: 11,
                        mx: 'auto',
                        bottom: -32,
                        position: 'absolute',
                    }}
                />

                <Image
                    src={`${CONFIG.assetsDir}/assets/illustrations/Classes.jpg`}
                    alt={classgr.homeroomTeacher.user.username}
                    ratio="16/9"
                    slotProps={{
                        overlay: {
                            sx: (theme) => ({
                                bgcolor: varAlpha(theme.vars.palette.common.blackChannel, 0.1),
                            }),
                        },
                    }}
                />
            </Box>

            <ListItemText
                sx={{ mt: 5, mb: 1 }}
                primary="Chủ nhiệm"
                secondary={classgr.homeroomTeacher.user.firstName}
                slotProps={{
                    primary: { sx: { typography: 'subtitle1' } },
                    secondary: { sx: { mt: 0.5 } },
                }}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box
                sx={{
                    py: 3,
                    display: 'grid',
                    typography: 'subtitle1',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                }}
            >
                {[
                    { label: 'Tên lớp', value: classgr.name },
                    { label: 'Khối', value: classgr.grade },
                    { label: 'Mô tả', value: classgr.description },
                ].map((stat) => (
                    <Box key={stat.label} sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
                        <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                            {stat.label}
                        </Box>
                        <Typography variant="subtitle2" color="text.primary" fontSize={12}>
                            {stat.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Card>
    );
}
