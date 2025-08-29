import { LocaleContextController } from 'context/locale/localeContextController/LocaleContextController';
import { AuthContextController } from 'context/auth/authContextController/AuthContextController';
import { ApiClientContextController } from '../context/apiClient/apiClientContextController/ApiClientContextController';

import { AppProvidersProps } from './AppProviders.types';

import { ThemeProvider } from '@/design-system/providers/ThemeProvider';

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ThemeProvider>
    <LocaleContextController>
      <ApiClientContextController>
        <AuthContextController>{children}</AuthContextController>
      </ApiClientContextController>
    </LocaleContextController>
  </ThemeProvider>
);
