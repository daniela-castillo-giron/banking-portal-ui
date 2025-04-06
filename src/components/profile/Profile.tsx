import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getData } from 'country-list';
import { useLoader } from '../../services/loaderModalService';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, setUserDetails } from '../../store/userSlice';
import { REDUX_SLICE_DATA_STATUS } from '../../utils/constants';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  countryCode: yup.string().required('Country code is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  password: yup.string().min(8).max(127).required('Password is required'),
});

const Profile = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.user);

  const [userProfile, setUserProfile] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { show, hide } = useLoader();

  const countries = getData().map((country) => ({
    label: `${country.name} (${country.code})`,
    value: country.code,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (userDetails.status === REDUX_SLICE_DATA_STATUS.IDLE) {
      dispatch(getUserDetails());
    } else if (userDetails.status === REDUX_SLICE_DATA_STATUS.SUCCEEDED) {
      setUserProfile(userDetails.data);
      reset(userDetails.data);
    } else if (userDetails.status === REDUX_SLICE_DATA_STATUS.FAILED) {
      console.error('User details fetching failed: ' + userDetails.error);
      toast.error('User details fetching failed: ' + userDetails.error);
    }
  }, [userDetails]);

  const onSubmit = async (data) => {
    try {
      show('Updating your profile...');
      const response = await authService.updateUserProfile(data);
      dispatch(setUserDetails(response));
      setShowUpdateForm(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('User details update failed: ' + error);
      toast.error('User details update failed: ' + (error?.response?.data || 'Something went wrong'));
    } finally {
      hide();
    }
  };

  // Only render the content if data has loaded successfully
  if (userDetails.status === REDUX_SLICE_DATA_STATUS.LOADING) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-slate-700 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">User Profile</h2>

        {!showUpdateForm ? (
          <div className="bg-gray-50 p-6 rounded-lg border shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Name', value: userProfile.name },
                { label: 'Email', value: userProfile.email },
                { label: 'Country Code', value: userProfile.countryCode },
                { label: 'Phone Number', value: userProfile.phoneNumber },
                { label: 'Address', value: userProfile.address },
                { label: 'Account Number', value: userProfile.accountNumber },
                { label: 'Branch', value: userProfile.branch },
                { label: 'Account Type', value: userProfile.accountType },
                { label: 'IFSC Code', value: userProfile.ifscCode },
              ].map((field, i) => (
                <div key={i}>
                  <label className="font-semibold text-size-md">{field.label}:</label>
                  <p className="text-slate-800">{field.value || 'N/A'}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowUpdateForm(true)}
                className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 font-medium"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                {...register('name')}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Country Code */}
            <div>
              <label className="block text-sm font-semibold mb-1">Country Code</label>
              <Select
                value={countries.find((c) => c.value === userProfile.countryCode)}
                options={countries}
                onChange={(selected) => selected && setValue('countryCode', selected.value, { shouldValidate: true })}
                placeholder="Select Country"
                className="text-sm"
              />
              {errors.countryCode && <p className="text-red-500 text-sm mt-1">{errors.countryCode.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold mb-1">Phone Number</label>
              <input
                {...register('phoneNumber')}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-1">Address</label>
              <input
                {...register('address')}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex gap-4 justify-between mt-6">
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                className="bg-gray-200 text-slate-700 font-semibold py-2 px-6 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
