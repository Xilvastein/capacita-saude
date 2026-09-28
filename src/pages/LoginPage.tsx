import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Settings, ShieldCheck } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { UserRole } from '@/types';

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('funcionario');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const name =
      selectedRole === 'gestor' ? 'Gestor Demonstrativo' : 'Funcionário Demonstrativo';
    const finalEmail = email || (selectedRole === 'gestor' ? 'gestor@demo.capacitasau.gov.br' : 'funcionario@demo.capacitasau.gov.br');
    setTimeout(() => {
      login(name, finalEmail, selectedRole);
      navigate(selectedRole === 'gestor' ? '/dashboard' : '/minha-area');
    }, 500);
  };

  const quickLogin = (role: UserRole) => {
    const name = role === 'gestor' ? 'Gestor Demonstrativo' : 'Funcionário Demonstrativo';
    const email = role === 'gestor' ? 'gestor@demo.capacitasau.gov.br' : 'funcionario@demo.capacitasau.gov.br';
    login(name, email, role);
    navigate(role === 'gestor' ? '/dashboard' : '/minha-area');
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left panel - branding */}
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-primary p-8 text-white lg:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-20 h-40 w-40 rounded-full border-[6px] border-white/20" />
          <div className="absolute right-20 top-40 h-32 w-32 rounded-full border-[6px] border-white/20" />
          <div className="absolute bottom-20 left-1/3 h-48 w-48 rounded-2xl border-[6px] border-white/20 rotate-12" />
        </div>

        <div className="relative z-10">
          <Logo showText={false} size="lg" />
          <h1 className="mt-8 text-3xl font-bold leading-tight lg:text-4xl">
            Capacita<span className="text-white/80">Saúde</span>
          </h1>
          <p className="mt-2 text-lg text-white/80">Conhecimento acessível no momento certo.</p>
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-xl font-semibold leading-snug">
            "Transformamos equipamentos hospitalares em pontos de aprendizagem acessíveis no próprio ambiente de trabalho."
          </p>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <ShieldCheck className="h-5 w-5" />
            <span>Capacitação acessível para fortalecer a saúde pública.</span>
          </div>
        </div>

        <div className="relative z-10 space-y-2 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span>Protótipo de inovação social</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span>Dados simulados para demonstração</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span>Não utiliza dados pessoais reais</span>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Entrar na demonstração</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use qualquer e-mail e senha para acessar. A autenticação é apenas demonstrativa.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@hospital.gov.br"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Perfil de acesso</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('funcionario')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    selectedRole === 'funcionario'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <User className={`h-6 w-6 ${selectedRole === 'funcionario' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Funcionário</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('gestor')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    selectedRole === 'gestor'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <Settings className={`h-6 w-6 ${selectedRole === 'gestor' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Gestor</span>
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na demonstração'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Acesso rápido</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => quickLogin('funcionario')} className="gap-2">
                <User className="h-4 w-4" />
                Funcionário
              </Button>
              <Button variant="outline" onClick={() => quickLogin('gestor')} className="gap-2">
                <Settings className="h-4 w-4" />
                Gestor
              </Button>
            </div>
          </div>

          <Card className="mt-6 border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Aviso:</strong> Este é um protótipo demonstrativo.
                A autenticação não é segura e não deve ser utilizada em ambiente de produção.
                Nenhum dado pessoal real é coletado ou armazenado.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
