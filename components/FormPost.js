import { useRouter } from 'next/router'
import { useState } from "react";
import User from "../pages/api/user";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Image from 'next/image';

export default function FormPost(props) {
    const user = props?.dataPost;
    const handleChange = (e) => {
        setData(prevState => (
            {
                ...prevState, [e.target.name]: e.target.value
            }
        ))
    }

    const isAddMode = !user;
    const router = useRouter()
    const [showAlert, setShowAlert] = useState("");

    //image
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('username is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        level: Yup.string()
            .required('level is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Password is required') : null)
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .when('password', (password, schema) => {
                if (password || isAddMode) return schema.required('Confirm Password is required');
            })
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if user passed in props
    if (!isAddMode) {
        const { password, confirmPassword, ...defaultValues } = user;
        formOptions.defaultValues = defaultValues;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(data);
    }

    async function createUser(data) {
        var tempData = {
            ...data,
            gambar: file 
        };  
        const res = await User.postData(tempData)
        if (res) {
            funcShowAlert("Create Data Success", `/${encodeURIComponent(res.id)}`);
        } else {
            funcShowAlert("gagal");
        }
    }

    async function updateUser(data) {  
        var tempData = {
            ...data,
            gambar: file 
        };  
        const res = await User.updtData(tempData)
        if (res) {
            funcShowAlert("Updated Data Success", "/");
        } else {
            funcShowAlert("gagal", `/${encodeURIComponent(res)}`);
        }
    }

    //alert
    async function funcShowAlert(msg, url = "") {
        setShowAlert(msg);
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                setShowAlert("")
                resolve(true)
                if (url != "") {
                    router.push(url)
                }
            }, 3000);
        })
    }


    // const navigate = useNavigate();

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        // console.log(image); 
        setPreview(URL.createObjectURL(image));
    };

    return (
        <>
            {showAlert != "" ? (
                <div
                    className={
                        "text-white px-6 py-4 border-0 rounded relative mb-4 bg-blue-500"
                    }
                >
                    <span className="text-xl inline-block mr-5 align-middle">
                        <i className="fas fa-bell" />
                    </span>
                    <span className="inline-block align-middle mr-8">
                        {showAlert}
                    </span>
                    <button
                        className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
                        onClick={() => setShowAlert("")}
                    >
                        <span>×</span>
                    </button>
                </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>

                <div className="field">
                    <label className="label">Image</label>
                    <div className="control">
                        <div className="file">
                            <label className="file-label">
                                <input
                                    type="file"
                                    className="file-input"
                                    onChange={loadImage}
                                /> 
                            </label>
                        </div>
                    </div>
                </div>

                {preview ? (
                    <figure className="image is-128x128">
                        <Image src={preview} alt='Preview Image' width="200" height="200" />
                    </figure>
                ) : (
                    ""
                )}

                <div>
                    <div className="mt-8 border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                        <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                            <p>
                                <label htmlFor="username" className="bg-white text-gray-600 px-1">Username *</label>
                            </p>
                        </div>
                        <input name="username" type="text" onChange={handleChange} {...register('username')} className={`py-1 px-1 text-gray-900 outline-none block h-full w-full form-control ${errors.username ? 'is-invalid' : ''}`} />
                    </div>
                    <div className=" text-red-500">{errors.username?.message}</div>
                </div>

                <div>
                    <div className="mt-8 border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                        <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                            <p>
                                <label htmlFor="email" className="bg-white text-gray-600 px-1">Email *</label>
                            </p>
                        </div>
                        <input name="email" type="text" onChange={handleChange} {...register('email')} className={`py-1 px-1 text-gray-900 outline-none block h-full w-full form-control ${errors.email ? 'is-invalid' : ''}`} />
                    </div>
                    <div className=" text-red-500">{errors.email?.message}</div>
                </div>

                <div>
                    <div className="mt-8 border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                        <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                            <p>
                                <label htmlFor="level" className="bg-white text-gray-600 px-1">Level *</label>
                            </p>
                        </div>
                        <input name="level" type="text" onChange={handleChange} {...register('level')} className={`py-1 px-1 text-gray-900 outline-none block h-full w-full form-control ${errors.level ? 'is-invalid' : ''}`} />
                    </div>
                    <div className=" text-red-500">{errors.level?.message}</div>
                </div>

                {!isAddMode &&
                    <div className=' text-red-500'>
                        <h3 className="pt-3">* Change Password</h3>
                        <p>Leave blank to keep the same password</p>
                    </div>
                }

                <div>
                    <div className="mt-8 border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                        <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                            <p>
                                <label htmlFor="password" className="bg-white text-gray-600 px-1"> Password *
                                    {/* {!isAddMode &&
                                    (!showPassword
                                        ? <span> - <a onClick={() => setShowPassword(!showPassword)} className="text-primary">Show</a></span>
                                        : <em> - {user.password}</em>
                                    )
                                } */}
                                </label>
                            </p>
                        </div>
                        <input name="password" type="text" onChange={handleChange} {...register('password')} className={`py-1 px-1 text-gray-900 outline-none block h-full w-full form-control ${errors.password ? 'is-invalid' : ''}`} />
                    </div>
                    <div className=" text-red-500">{errors.password?.message}</div>
                </div>

                <div>
                    <div className="mt-8 border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                        <div className="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                            <p>
                                <label htmlFor="confirmPassword" className="bg-white text-gray-600 px-1">confirmPassword *</label>
                            </p>
                        </div>
                        <input name="confirmPassword" type="text" onChange={handleChange} {...register('confirmPassword')} className={`py-1 px-1 text-gray-900 outline-none block h-full w-full form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                    </div>
                    <div className=" text-red-500">{errors.confirmPassword?.message}</div>
                </div>

                <div className="form-group">
                    <button type="submit" disabled={formState.isSubmitting} className=" mr-2 bg-blue-500 p-2 mt-5 rounded-lg text-white">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className=" mr-2 bg-green-500 p-2 mt-5 rounded-lg text-white">Reset</button>
                    {/* <Link href="/users" className="btn btn-link">Cancel</Link> */}
                </div>
            </form>
        </>
    );
}

