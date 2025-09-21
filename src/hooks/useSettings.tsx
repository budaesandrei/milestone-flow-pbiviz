import React, { createContext, useContext, ReactNode } from 'react';
import { VisualFormattingSettingsModel } from '../settings';

interface SettingsContextType {
    settings: VisualFormattingSettingsModel;
    updateSettings: (newSettings: Partial<VisualFormattingSettingsModel>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

interface SettingsProviderProps {
    children: ReactNode;
    initialSettings: VisualFormattingSettingsModel;
    onSettingsChanged: (settings: VisualFormattingSettingsModel) => void;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
    children,
    initialSettings,
    onSettingsChanged
}) => {
    const [settings, setSettings] = React.useState<VisualFormattingSettingsModel>(initialSettings);

    // Update settings when initialSettings prop changes
    React.useEffect(() => {
        setSettings(initialSettings);
    }, [initialSettings]);

    const updateSettings = (newSettings: Partial<VisualFormattingSettingsModel>) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        onSettingsChanged(updatedSettings);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
