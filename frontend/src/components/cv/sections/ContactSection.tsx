"use client";

import React from 'react';
import { useCV } from '../../../contexts/CVContext';
import { TextField } from '../../ui/Field';
import type { Contact } from '../../../types/cv';

export function ContactSection() {
  const { cv, update } = useCV();

  const setField = (key: keyof Contact) => (value: string) =>
    update(
      (prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }),
      `contact-${key}`
    );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        label="Full Name"
        value={cv.contact.fullName}
        onChange={setField('fullName')}
        placeholder="Ahmed Amr"
        invalid={cv.contact.fullName.trim() === ''}
        error={
          cv.contact.fullName.trim() === '' ? 'Your name is required.' : undefined
        }
      />
      
      <TextField
        label="Professional Headline / Title"
        value={cv.contact.jobTitle}
        onChange={setField('jobTitle')}
        placeholder="Junior Machine Learning Engineer | Data Analyst"
        hint="Benchmark keywords for your target role."
      />
      
      <TextField
        label="Phone Number"
        value={cv.contact.phone}
        onChange={setField('phone')}
        type="tel"
        placeholder="+20 111 139 3711"
      />
      
      <TextField
        label="Email Address"
        value={cv.contact.email}
        onChange={setField('email')}
        type="email"
        placeholder="ahmedamr021222@gmail.com"
        invalid={
          cv.contact.email.trim() !== '' && !cv.contact.email.includes('@')
        }
        error={
          cv.contact.email.trim() !== '' && !cv.contact.email.includes('@')
            ? 'Add a valid email so recruiters can reach you.'
            : undefined
        }
      />

      <TextField
        label="Location / City"
        value={cv.contact.location}
        onChange={setField('location')}
        placeholder="Cairo, Egypt"
      />
      
      <TextField
        label="LinkedIn Profile URL"
        value={cv.contact.linkedin || ''}
        onChange={setField('linkedin')}
        placeholder="https://linkedin.com/in/username"
      />

      <TextField
        label="GitHub Profile URL"
        value={cv.contact.github || ''}
        onChange={setField('github')}
        placeholder="https://github.com/username"
      />

      <TextField
        label="Portfolio / Website URL"
        value={cv.contact.portfolio || ''}
        onChange={setField('portfolio')}
        placeholder="https://yourportfolio.com"
      />
    </div>
  );
}
