import React, { useContext } from 'react'
import { useState } from 'react'
import { apiConfig } from '../../API/apiConfigs'
import './update.scss'
import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Close from "@mui/icons-material/Close";
import { AuthContext } from '../../context/authContext'

const Update = ({ setOpenUpdate, user }) => {
    const {currentUser, setCurrentUser } = useContext(AuthContext);

    const [cover, setCover] = useState(null)
    const [profile, setProfile] = useState(null)

    const [texts, setTexts] = useState({
        email: user.email,
        password: user.password,
        name: user.name,
        city: user.city,
        website: user.website,
    })

    const upload = async (file) => {

        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await apiConfig.post("/upload", formData);
            return res.data;

        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        setTexts(prev => ({
            ...prev,
            [e.target.name]: [e.target.value]
        }))
    }

    const queryClient = useQueryClient();

    // Mutations
    const mutation = useMutation({
        mutationFn: user => {
            return apiConfig.put("/v1/users", user)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        let coverUrl = cover ? await upload(cover) : user.coverPicture;
        let profileUrl = profile ? await upload(profile) : user.profilePicture;

        setCurrentUser({ ...currentUser, coverPicture: coverUrl, profilePicture: profileUrl });
        mutation.mutate({ ...texts, coverPicture: coverUrl, profilePicture: profileUrl });
        
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
    }


    return (
        <div className="update">
            <div className="wrapper">
                <h1>Update Your Profile</h1>
                <form>
                    <div className="files">
                        <label htmlFor="cover">
                            <span>Cover Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        cover
                                            ? URL.createObjectURL(cover)
                                            : "/upload/" + user.coverPicture
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="cover"
                            style={{ display: "none" }}
                            onChange={(e) => setCover(e.target.files[0])}
                        />
                        <label htmlFor="profile">
                            <span>Profile Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        profile
                                            ? URL.createObjectURL(profile)
                                            : "/upload/" + user.profilePicture
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profile"
                            style={{ display: "none" }}
                            onChange={(e) => setProfile(e.target.files[0])}
                        />
                    </div>
                    <label>Email</label>
                    <input
                        type="text"
                        value={texts.email}
                        name="email"
                        onChange={handleChange}
                    />
                    <label>Password</label>
                    <input
                        type="text"
                        value={texts.password}
                        name="password"
                        onChange={handleChange}
                    />
                    <label>Name</label>
                    <input
                        type="text"
                        value={texts.name}
                        name="name"
                        onChange={handleChange}
                    />
                    <label>Country / City</label>
                    <input
                        type="text"
                        name="city"
                        value={texts.city}
                        onChange={handleChange}
                    />
                    <label>Website</label>
                    <input
                        type="text"
                        name="website"
                        value={texts.website}
                        onChange={handleChange}
                    />
                    <button onClick={handleSubmit}>Update</button>
                </form>
                <button className="close" onClick={() => setOpenUpdate(false)}>
                    <Close/>
                </button>
            </div>
        </div>
    )
}

export default Update