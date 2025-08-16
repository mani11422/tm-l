import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.tsx';
import { useAuth } from '@/hooks/useAuth.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { UserRole } from '@/types';

export function LoginForm() {
  const [email, setEmail] = useState('admin@taskmaster.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success && result.user) {
      toast({
        title: `Welcome back, ${result.user.name}!`,
        description: `You've successfully logged in as a ${result.user.role}.`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Only two roles: Admin (employer) and User (employee)
  const handleDemoLogin = (role: UserRole) => {
    const roleEmailMap: Record<UserRole, string> = {
      Admin: 'admin@taskmaster.com',
      User: 'employee@taskmaster.com',
    };
    setEmail(roleEmailMap[role]);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">TM</span>
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Welcome to TaskMaster SaaS
            </CardTitle>
            <CardDescription className="text-gray-400">
              The all-in-one task & project management platform for startups. <br />
              <span className="font-semibold text-purple-300">Sign up is only available for employers (admins). Employees are invited by their employer.</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-center text-sm text-gray-400 mb-4">Or sign in as a demo user:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleDemoLogin('Admin')} className="text-purple-300 border-purple-500/50 hover:bg-purple-500/20 hover:text-purple-200">Employer (Admin)</Button>
                <Button variant="outline" onClick={() => handleDemoLogin('User')} className="text-blue-300 border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-200">Employee (User)</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}