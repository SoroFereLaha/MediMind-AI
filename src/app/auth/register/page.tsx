'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/auth-layout';
import { metadata } from '../metadata';

const registerSchema = z.object({
  role: z.enum(['patient', 'medecin'], { required_error: 'Veuillez sélectionner un rôle' }),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log('Rôle choisi:', data.role);
    // TODO: Implémenter l'inscription
    console.log('Inscription:', data);
    router.push('/');
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Inscription</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Sélection du rôle */}
              <div>
                <Label>Vous êtes :</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" value="patient" {...register('role')} />
                    Patient
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" value="medecin" {...register('role')} />
                    Médecin
                  </label>
                </div>
                {errors.role && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.role.message}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Votre prénom"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.firstName.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Votre nom"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.lastName.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.email.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.password.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.confirmPassword.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              S'inscrire
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground">
                Déjà un compte ?{' '}
                <a href="/auth/login" className="text-primary hover:underline">
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </AuthLayout>
  );
}
