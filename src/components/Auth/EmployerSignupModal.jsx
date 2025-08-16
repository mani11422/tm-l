import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function EmployerSignupModal({ open, onClose, onSignup }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    employees: '',
    industry: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Store employer data in localStorage
    const employers = JSON.parse(localStorage.getItem('employers') || '[]');
    employers.push({ ...form, role: 'Admin', createdAt: new Date().toISOString() });
    localStorage.setItem('employers', JSON.stringify(employers));
    setLoading(false);
    onSignup && onSignup(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up as Employer (Admin)</DialogTitle>
          <DialogDescription>
            Create your startup's organization account. Employees can be invited after signup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input name="name" label="Your Name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <Input name="email" label="Email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <Input name="password" label="Password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <Input name="organization" label="Organization Name" placeholder="Startup Name" value={form.organization} onChange={handleChange} required />
          <Input name="employees" label="Number of Employees" type="number" placeholder="e.g. 10" value={form.employees} onChange={handleChange} required min={1} />
          <Input name="industry" label="Industry" placeholder="e.g. SaaS, Fintech" value={form.industry} onChange={handleChange} />
          <Input name="website" label="Website" placeholder="https://" value={form.website} onChange={handleChange} />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
