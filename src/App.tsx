import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/hooks/use-app';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EquipmentCatalogPage } from '@/pages/EquipmentCatalogPage';
import { EquipmentDetailPage } from '@/pages/EquipmentDetailPage';
import { EquipmentFormPage } from '@/pages/EquipmentFormPage';
import { QRCodePage } from '@/pages/QRCodePage';
import { TrainingsPage } from '@/pages/TrainingsPage';
import { TrainingDetailPage } from '@/pages/TrainingDetailPage';
import { EmployeeAreaPage } from '@/pages/EmployeeAreaPage';
import { CapacityNeedsPage } from '@/pages/CapacityNeedsPage';
import { IndicatorsPage } from '@/pages/IndicatorsPage';
import { ImportDataPage } from '@/pages/ImportDataPage';
import { MethodologyPage } from '@/pages/MethodologyPage';
import { AboutPage } from '@/pages/AboutPage';
import { Toaster } from '@/components/ui/sonner';

function AppRoutes() {
  const { user } = useApp();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute roles={['gestor']}><DashboardPage /></ProtectedRoute>} />
        <Route path="/minha-area" element={<ProtectedRoute roles={['funcionario']}><EmployeeAreaPage /></ProtectedRoute>} />
        <Route path="/equipamentos" element={<EquipmentCatalogPage />} />
        <Route path="/equipamentos/novo" element={<ProtectedRoute roles={['gestor']}><EquipmentFormPage /></ProtectedRoute>} />
        <Route path="/equipamentos/editar/:id" element={<ProtectedRoute roles={['gestor']}><EquipmentFormPage /></ProtectedRoute>} />
        <Route path="/equipamentos/:id" element={<EquipmentDetailPage />} />
        <Route path="/qr-code" element={<QRCodePage />} />
        <Route path="/treinamentos" element={<TrainingsPage />} />
        <Route path="/treinamentos/:id" element={<TrainingDetailPage />} />
        <Route path="/necessidades" element={<ProtectedRoute roles={['gestor']}><CapacityNeedsPage /></ProtectedRoute>} />
        <Route path="/indicadores" element={<ProtectedRoute roles={['gestor']}><IndicatorsPage /></ProtectedRoute>} />
        <Route path="/importar" element={<ProtectedRoute roles={['gestor']}><ImportDataPage /></ProtectedRoute>} />
        <Route path="/metodologia" element={<MethodologyPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/" element={<Navigate to={user.role === 'gestor' ? '/dashboard' : '/minha-area'} replace />} />
        <Route path="*" element={<Navigate to={user.role === 'gestor' ? '/dashboard' : '/minha-area'} replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </HashRouter>
    </AppProvider>
  );
}
