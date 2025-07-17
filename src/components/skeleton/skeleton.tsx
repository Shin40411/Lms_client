import { Box, Skeleton } from "@mui/material";

export function SkeletonScreen() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
            <Box>
                <Skeleton variant="rectangular" width={480} height={118} />
                <Box sx={{ pt: 0.5 }}>
                    <Skeleton width={480} height={10} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                </Box>
            </Box>
            <Box>
                <Skeleton variant="rectangular" width={480} height={118} />
                <Box sx={{ pt: 0.5 }}>
                    <Skeleton width={480} height={10} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                </Box>
            </Box>
            <Box>
                <Skeleton variant="rectangular" width={480} height={118} />
                <Box sx={{ pt: 0.5 }}>
                    <Skeleton width={480} height={10} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                    <Skeleton width={480} height={10} sx={{ mt: 0.5 }} />
                </Box>
            </Box>
        </Box>
    );
}