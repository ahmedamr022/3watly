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
        } />
      
      <TextField
        label="Job Title"
        value={cv.contact.jobTitle}
        onChange={setField('jobTitle')}
        placeholder="Data Analyst"
        hint="Used to benchmark keywords for your target role." />
      
      <TextField
        label="Phone"
        value={cv.contact.phone}
        onChange={setField('phone')}
        type="tel"
        placeholder="+20 100 123 4567" />
      
      <TextField
        label="Email"
        value={cv.contact.email}
        onChange={setField('email')}
        type="email"
        placeholder="you@email.com"
        invalid={
        cv.contact.email.trim() !== '' && !cv.contact.email.includes('@')
        }
        error={
        cv.contact.email.trim() !== '' && !cv.contact.email.includes('@') ?
        'Add a valid email so recruiters can reach you.' :
        undefined
        } />
      
      <TextField
        label="LinkedIn"
        value={cv.contact.linkedin}
        onChange={setField('linkedin')}
        placeholder="linkedin.com/in/username" />
      
      <TextField
        label="Location"
        value={cv.contact.location}
        onChange={setField('location')}
        placeholder="Cairo, Egypt" />
      
    </div>);

}
