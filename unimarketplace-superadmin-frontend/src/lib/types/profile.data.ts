export interface ProfileData {
  title: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  university: string;
  universityLogo: string;
  universityName: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  personalPhone: string;
  education: string;
}

export const profileData: ProfileData = {
  title: '',
  name: 'Admin',
  role: 'Administrator',
  email: 'admin@admin.com',
  phone: '+91 123456789',
  image:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  university: 'Administrator',
  universityLogo:
    'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&q=80',
  universityName: 'Indian Institute of Technology, Gandhinagar',
  firstName: 'Admin',
  lastName: 'Super',
  personalEmail: 'admin@admin.com',
  personalPhone: '+91 123456789',
  education: 'Manager',
};
