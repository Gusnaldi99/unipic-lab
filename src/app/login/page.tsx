'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Jika sudah login, redirect langsung ke dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Harap isi email dan password.');
      return;
    }

    if (activeTab === 'signup' && !fullName.trim()) {
      setErrorMessage('Harap isi nama lengkap tim.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Email atau password tidak sesuai.');
          } else if (error.message.includes('Email not confirmed')) {
            setErrorMessage('Email belum dikonfirmasi. Periksa inbox email Anda.');
          } else {
            setErrorMessage(error.message);
          }
        } else {
          router.replace('/');
        }
      } else {
        const { error, needsEmailConfirmation } = await signUp(
          email.trim(),
          password,
          fullName.trim()
        );

        if (error) {
          if (error.message.includes('already registered')) {
            setErrorMessage('Email ini sudah terdaftar. Silakan masuk.');
          } else {
            setErrorMessage(error.message);
          }
        } else {
          if (needsEmailConfirmation) {
            setSuccessMessage(
              'Pendaftaran berhasil! Cek email Anda untuk konfirmasi tautan login, lalu masuk kembali.'
            );
          } else {
            setSuccessMessage('Akun tim berhasil dibuat! Anda langsung dialihkan...');
            router.replace('/');
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="login-screen-wrapper">
        <div className="login-loading-card">
          <div className="login-spinner" />
          <p>Memeriksa sesi login...</p>
        </div>
      </div>
    );
  }

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="login-screen-wrapper">
      <div className="login-box-container">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-pill">
            <Sparkles size={18} className="login-logo-icon" />
            <span>UNIPIC LAB</span>
          </div>
          <h1 className="login-main-title">Portal Akses Tim Agency</h1>
          <p className="login-sub-title">
            Kelola kalender konten, pipeline produksi, dan pantau aktivitas perubahan tim secara real-time.
          </p>
        </div>

        {!isConfigured && (
          <div className="login-alert-banner alert-warning">
            <AlertCircle size={16} />
            <span>
              Koneksi Supabase belum aktif di file <code>.env.local</code>. Pastikan URL dan Anon Key sudah terisi.
            </span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="login-tab-switcher">
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
          >
            Daftar Akun Tim
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="login-alert-banner alert-error" role="alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="login-alert-banner alert-success" role="status">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {activeTab === 'signup' && (
            <div className="login-field-group">
              <label htmlFor="fullNameInput">Nama Lengkap Tim</label>
              <div className="login-input-wrap">
                <User size={16} className="login-field-icon" />
                <input
                  id="fullNameInput"
                  type="text"
                  placeholder="Contoh: Agis Pratama"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <span className="login-field-hint">
                Nama ini akan muncul pada jejak aktivitas saat Anda mengubah atau memindahkan konten.
              </span>
            </div>
          )}

          <div className="login-field-group">
            <label htmlFor="emailInput">Email Tim</label>
            <div className="login-input-wrap">
              <Mail size={16} className="login-field-icon" />
              <input
                id="emailInput"
                type="email"
                placeholder="nama@unipiclab.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-field-group">
            <label htmlFor="passwordInput">Password</label>
            <div className="login-input-wrap">
              <Lock size={16} className="login-field-icon" />
              <input
                id="passwordInput"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={isSubmitting || !isConfigured}
          >
            {isSubmitting ? (
              <span className="btn-loading-flex">
                <div className="login-spinner-sm" />
                <span>Memproses...</span>
              </span>
            ) : (
              <span className="btn-loading-flex">
                <span>{activeTab === 'signin' ? 'Masuk ke Dashboard' : 'Buat Akun Tim'}</span>
                <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="login-security-footer">
          <ShieldCheck size={14} />
          <span>Keamanan autentikasi terenkripsi oleh Supabase Auth</span>
        </div>
      </div>
    </div>
  );
}

