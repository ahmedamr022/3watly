export type FeatureIcon = 'matching' | 'insights' | 'growth' | 'target' | 'trend';

export interface Feature {
  icon: FeatureIcon;
  tone: 'blue' | 'green' | 'violet';
  title: string;
  description: string;
}

export const loginFeatures: Feature[] = [
{
  icon: 'matching',
  tone: 'blue',
  title: 'AI-Powered Matching',
  description: 'Find opportunities that truly fit you.'
},
{
  icon: 'insights',
  tone: 'green',
  title: 'Real-time Market Insights',
  description: 'Stay ahead with data you can trust.'
},
{
  icon: 'growth',
  tone: 'violet',
  title: 'Personalized Growth',
  description: 'Get recommendations to grow your skills and advance your career.'
}];


export const signUpFeatures: Feature[] = [
{
  icon: 'trend',
  tone: 'green',
  title: 'AI-Powered Insights',
  description: 'Get role recommendations and market insights tailored to your skills.'
},
{
  icon: 'target',
  tone: 'blue',
  title: 'Smart Matching',
  description: 'We match you with high-fit opportunities you can grow with.'
},
{
  icon: 'growth',
  tone: 'violet',
  title: 'Career Growth',
  description: 'Personalized recommendations to help you learn, improve, and advance.'
}];


export const passwordRules = ['At least 8 characters', 'One uppercase letter', 'One number'];

export const navLinks = [
{ label: 'Jobs', icon: 'briefcase' as const },
{ label: 'Market Insights', icon: 'chart' as const },
{ label: 'CV Builder', icon: 'file' as const },
{ label: 'Resources', icon: 'none' as const, hasDropdown: true }];