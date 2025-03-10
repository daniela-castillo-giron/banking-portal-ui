import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getData } from 'country-list';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  countryCode: yup.string().required('Country code is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  password: yup.string().min(8).max(127).required('Password is required'),
});

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const countries = getData().map((country) => ({
    label: `${country.name} (${country.code})`,
    value: country.code,
  }));

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getUserProfileData();
  }, []);

  const getUserProfileData = () => {
    authService.getUserDetails().then((response) => {
      setUserProfile(response);
      reset(response); // Fill form with fetched data
    }).catch((error) => {
      console.error('User details fetching failed: ' + error);
      toast.error('User details fetching failed: ' + error);
    });
  };

  const onSubmit = (data) => {
    authService.updateUserProfile(data).then((response) => {
      setUserProfile(response);
      setShowUpdateForm(false);
      toast.success('Profile updated successfully');
    }).catch((error) => {
      console.error('User details update failed: ' + error);
      toast.error('User details update failed: ' + error?.response?.data || 'Something went wrong');
    });
  };

  if (!userProfile) return null;

  return (
    <div className="container mx-auto md:p-5 p-0">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">{showUpdateForm ? "Edit" : ""} User Profile</h1>

      {!showUpdateForm ? (
        <div className="rounded-lg bg-white md:p-6 p-2 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div key="name">
              <label className="font-semibold">Name:</label>
              <span className="text-gray-800 block">{userProfile.name || 'N/A'}</span>
            </div>
            <div key="email">
              <label className="font-semibold">Email:</label>
              <span className="text-gray-800 block">{userProfile.email || 'N/A'}</span>
            </div>
            <div key="countryCode">
              <label className="font-semibold">Country Code:</label>
              <span className="text-gray-800 block">{userProfile.countryCode || 'N/A'}</span>
            </div>
            <div key="address">
              <label className="font-semibold">Address:</label>
              <span className="text-gray-800 block">{userProfile.address || 'N/A'}</span>
            </div>
            <div key="phoneNumber">
              <label className="font-semibold">Phone Number:</label>
              <span className="text-gray-800 block">{userProfile.phoneNumber || 'N/A'}</span>
            </div>
            <div key="accountNumber">
              <label className="font-semibold">Account Number:</label>
              <span className="text-gray-800 block">{userProfile.accountNumber || 'N/A'}</span>
            </div>
            <div key="branch">
              <label className="font-semibold">Branch:</label>
              <span className="text-gray-800 block">{userProfile.branch || 'N/A'}</span>
            </div>
            <div key="accountType">
              <label className="font-semibold">Account Type:</label>
              <span className="text-gray-800 block">{userProfile.accountType || 'N/A'}</span>
            </div>
            <div key="ifscCode">
              <label className="font-semibold">IFSC Code:</label>
              <span className="text-gray-800 block">{userProfile.ifscCode || 'N/A'}</span>
            </div>
          </div>
          <button onClick={() => setShowUpdateForm(true)} className="mt-6 bg-blue-100 text-indigo-900 py-2 px-4 rounded-lg hover:bg-blue-200">
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg md:p-6 p-2">
          {/* Name */}
          <div className="mb-4">
            <label className="font-semibold">Name:</label>
            <input
              {...register('name')}
              type="text"
              className={`border rounded p-2 w-full focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="font-semibold">Email:</label>
            <input
              {...register('email')}
              type="email"
              className={`border rounded p-2 w-full focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Country Code (Dropdown ready) */}
          <div className="mb-4">
            <label className="font-semibold">Country Code:</label>
            <Select
              value={countries.find((country) => country.value === userProfile.countryCode)}
              options={countries}
              onChange={(selected) => selected ? setValue('countryCode', selected.value, { shouldValidate: true }) : null}
              className="w-full rounded-lg shadow-sm"
              placeholder="Select Country"
            />
            {errors.countryCode && <p className="text-red-500 text-sm">{errors.countryCode.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="font-semibold">Phone Number:</label>
            <input
              {...register('phoneNumber')}
              type="text"
              className={`border rounded p-2 w-full focus:outline-none ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="font-semibold">Address:</label>
            <input
              {...register('address')}
              type="text"
              className={`border rounded p-2 w-full focus:outline-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="font-semibold">Password:</label>
            <input
              {...register('password')}
              type="password"
              className={`border rounded p-2 w-full focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Save Changes</button>
            <button type="button" onClick={() => setShowUpdateForm(false)} className="mt-6 bg-gray-100 text-slate-800 py-2 px-4 rounded hover:bg-indigo-50">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
