import React from 'react';
import { useGetProfileQuery } from '../../api/authApi';

const Profile: React.FC = () => {
  const { data, isLoading, error } = useGetProfileQuery();

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Failed to load profile</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Role:</strong> {data.role}</p>
    </div>
  );
};

export default Profile;
