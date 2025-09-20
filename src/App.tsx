import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSettings } from './hooks/useSettings';
import { useData } from './hooks/useData';
import { useViewport } from './hooks/useViewport';

const App: React.FC = () => {
    // Access hooks - available throughout your component tree
    const { settings, updateSettings } = useSettings();
    const { dataViews } = useData();
    const { viewport } = useViewport();

    return (
        <Box
            sx={{
                width: viewport?.width || '100%',
                height: viewport?.height || '100%',
                padding: 2,
                overflow: 'hidden'
            }}
        >
            <Typography variant="h6">
                Settings Test: {settings.general.replaceThis.value}
            </Typography>
            {/* Add your milestone flow components here */}
        </Box>
    );
};

export default App;
