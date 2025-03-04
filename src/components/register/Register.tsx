import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthService from '../../services/authService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getData } from 'country-list';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid Email').required('Email is required'),
  countryCode: yup.string().required('Country Code is required'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{8,15}$/, 'Invalid phone number'),
  address: yup.string().required('Address is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'At least 8 characters')
    .max(127, 'At most 127 characters')
    .matches(/[A-Z]/, 'At least one uppercase letter')
    .matches(/[a-z]/, 'At least one lowercase letter')
    .matches(/[0-9]/, 'At least one digit')
    .matches(/[^A-Za-z0-9]/, 'At least one special character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const [registrationData, setRegistrationData] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const countries = getData().map((country) => ({
    label: `${country.name} (${country.code})`,
    value: country.code,
  }));

  const onSubmit = async (data) => {
    try {
      const response = await AuthService.registerUser(data);
      setRegistrationData(response);
      toast.success('Registration successful!');
      reset();
    } catch (error) {
      console.error('User registration failed: ' + error);
      toast.error('User registration failed: ' + error);
    }
  };

  return (
    <div className="m-2 flex items-center justify-center coverparentspace">
      <div className="max-w-md w-full">
        {!registrationData ? (
          <div className="border-none md:border border-gray-300 px-4 py-3 mb-8 bg-white rounded-lg shadow-none md:shadow-md">
            <h2 className="my-3 text-center text-3xl font-extrabold text-gray-900">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2">Name:</label>
                  <input {...register('name')} className="w-full px-3 py-2 border rounded-lg shadow-sm" />
                  <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2">Email:</label>
                  <input {...register('email')} className="w-full px-3 py-2 border rounded-lg shadow-sm" />
                  <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2">Country Code:</label>
                  <Select
                    options={countries}
                    onChange={(selected) => selected ? setValue('countryCode', selected.value, { shouldValidate: true }) : null}
                    className="w-full rounded-lg shadow-sm"
                    placeholder="Select Country"
                  />
                    <p className="text-red-500 text-sm mt-1">{errors.countryCode?.message}</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2">Phone Number:</label>
                  <input {...register('phoneNumber')} className="w-full px-3 py-2 border rounded-lg shadow-sm" />
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber?.message}</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-2">Address:</label>
                  <input {...register('address')} className="w-full px-3 py-2 border rounded-lg shadow-sm" />
                  <p className="text-red-500 text-sm mt-1">{errors.address?.message}</p>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-bold mb-2">Password:</label>
                  <input type="password" {...register('password')} className="w-full px-3 py-2 border rounded-lg shadow-sm" />
                  <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-bold mb-2">Confirm Password:</label>
                  <input type="password" {...register('confirmPassword')} className="w-full px-3 py-2 border rounded-lg shadow-sm" />
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="mb-2 text-2xl font-bold text-gray-900 text-center">Registration Successful!</h5>
            <p className="mb-3 font-normal text-gray-700">Name: <span className="font-medium">{registrationData.name}</span></p>
            <p className="mb-3 font-normal text-gray-700">Email: <span className="font-medium">{registrationData.email}</span></p>
            <p className="mb-3 font-normal text-gray-700">Account Number: <span className="font-medium">{registrationData.accountNumber}</span></p>
            <p className="mb-3 font-normal text-gray-700">Branch: <span className="font-medium">{registrationData.branch}</span></p>

            <div className="mt-4 flex items-center justify-center">
              <button onClick={() => navigate('/login')} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Continue to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
