import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Rocket, Zap, Sparkles, Check } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Login realizado com sucesso!');
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Conta criada com sucesso!');
        }
      }
    } catch (error) {
      toast.error('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap, text: 'Criação de conteúdo com IA' },
    { icon: Rocket, text: 'Agendamento inteligente' },
    { icon: Sparkles, text: 'Análise de performance' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-accent to-secondary p-12 flex-col justify-between overflow-hidden"
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1.2, 1, 1.2],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [-20, 20, -20],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-2xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Zenith</h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold text-white mb-6 leading-tight"
          >
            Transforme suas ideias<br />em conteúdo incrível
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/90 mb-12"
          >
            Planejamento inteligente de conteúdo com o poder da IA
          </motion.p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 text-white"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 text-white/60 text-sm"
        >
          © 2024 Zenith. Todos os direitos reservados.
        </motion.div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Zenith
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-3xl shadow-xl border border-border p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
              </h2>
              <p className="text-muted-foreground">
                {isLogin ? 'Entre para continuar sua jornada' : 'Comece gratuitamente hoje'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nome completo
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-muted border-2 border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all"
                      placeholder="Seu nome"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  E-mail
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-muted border-2 border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Senha
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-muted border-2 border-transparent rounded-xl focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {isLogin ? 'Entrar agora' : 'Criar conta gratuita'}
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-accent-dark to-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">
                  {isLogin ? 'Novo por aqui?' : 'Já tem uma conta?'}
                </span>
              </div>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full py-3 rounded-xl border-2 border-border hover:border-primary text-foreground font-semibold transition-all hover:bg-muted"
            >
              {isLogin ? 'Criar conta gratuita' : 'Entrar na minha conta'}
            </button>
          </div>

          {/* Security note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            🔒 Suas informações estão protegidas com criptografia de ponta a ponta
          </p>
        </motion.div>
      </div>
    </div>
  );
};
