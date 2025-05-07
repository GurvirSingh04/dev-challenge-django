import React, { Suspense } from 'react';
import { ChakraProvider, extendTheme, Spinner, Center, Container } from '@chakra-ui/react';
import DefaultLayout from './components/layouts/Default';
import theme from './theme';

/**
 * Lazily loaded SavingsCalculator component to improve initial load time
 */
const SavingsCalculator = React.lazy(() => import('./components/SavingsCalculator'));

const defaultTheme = extendTheme(theme);

/**
 * Root component for the application
 * Sets up theming, layout, and code-splitting with Suspense
 * @returns The rendered application
 */
function App() {
    return (
        <ChakraProvider theme={defaultTheme}>
            <DefaultLayout>
                <Suspense fallback={<Center h="500px"><Spinner size="xl" /></Center>}>
                    <Container pt={6} maxW="1400px">
                        <SavingsCalculator />
                    </Container>
                </Suspense>
            </DefaultLayout>
        </ChakraProvider>
    );
}

export default App;